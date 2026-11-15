"""Escenas fotorrealistas (Cycles) para Vantgard Systems.
Uso: python scenes.py <escena> <ancho> <alto> <muestras> <salida.png>
Estilo: fotografía editorial en B&N, negros profundos, un solo acento naranja #FB5607.
"""
import math
import random
import sys

import bpy  # noqa: E402  (bpy debe cargarse antes que bmesh)
import bmesh
import numpy as np
from mathutils import Euler, Vector

ORANGE = (1.0, 0.16, 0.012)  # #FB5607 en lineal aprox.

# ------------------------------------------------------------------ base

def reset(w, h, samples):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = samples
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.02
    sc.cycles.use_denoising = True
    try:
        sc.cycles.denoiser = "OPENIMAGEDENOISE"
    except Exception:
        pass
    sc.cycles.max_bounces = 8
    sc.cycles.transmission_bounces = 8
    sc.cycles.glossy_bounces = 6
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 1.0
    sc.render.resolution_x = w
    sc.render.resolution_y = h
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_depth = "16"
    sc.render.threads_mode = "AUTO"
    sc.view_settings.view_transform = "AgX"
    for look in ("AgX - Medium High Contrast", "AgX - High Contrast", "Medium High Contrast", "High Contrast"):
        try:
            sc.view_settings.look = look
            break
        except Exception:
            continue
    world = bpy.data.worlds.new("W")
    sc.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.0015, 0.0016, 0.0018, 1)
    bg.inputs[1].default_value = 1.0
    return sc


def mat(name, color=(0.02, 0.02, 0.022), rough=0.5, metal=0.0, coat=0.0, coat_rough=0.05,
        transmission=0.0, ior=1.45, emission=None, strength=0.0, spec=0.5, bump=None, subsurface=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    p.inputs["IOR"].default_value = ior
    for key, val in (("Coat Weight", coat), ("Coat Roughness", coat_rough), ("Transmission Weight", transmission),
                     ("Specular IOR Level", spec), ("Subsurface Weight", subsurface)):
        if key in p.inputs:
            p.inputs[key].default_value = val
    if emission is not None:
        p.inputs["Emission Color"].default_value = (*emission, 1)
        p.inputs["Emission Strength"].default_value = strength
    if bump:
        scale, strength_b, detail = bump
        tex = nt.nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = scale
        tex.inputs["Detail"].default_value = detail
        if "Roughness" in tex.inputs:
            tex.inputs["Roughness"].default_value = 0.6
        bmp = nt.nodes.new("ShaderNodeBump")
        bmp.inputs["Strength"].default_value = strength_b
        nt.links.new(tex.outputs["Fac"], bmp.inputs["Height"])
        nt.links.new(bmp.outputs["Normal"], p.inputs["Normal"])
        # micro-variación de rugosidad
        mr = nt.nodes.new("ShaderNodeMapRange")
        mr.inputs["To Min"].default_value = rough * 0.75
        mr.inputs["To Max"].default_value = min(1, rough * 1.25)
        nt.links.new(tex.outputs["Fac"], mr.inputs["Value"])
        nt.links.new(mr.outputs["Result"], p.inputs["Roughness"])
    return m


def emit_mat(name, color=ORANGE, strength=20.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        if n.type == "BSDF_PRINCIPLED":
            nt.nodes.remove(n)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    nt.links.new(e.outputs[0], nt.nodes["Material Output"].inputs["Surface"])
    return m


def glass(name="Glass", rough=0.22, tint=(0.95, 0.96, 0.97)):
    return mat(name, color=tint, rough=rough, transmission=1.0, ior=1.47, spec=0.6)


def link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def assign(obj, m):
    obj.data.materials.clear()
    obj.data.materials.append(m)
    return obj


def mesh_obj(name, verts, faces, m=None, smooth=True):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], [tuple(f) for f in faces])
    me.update()
    if smooth:
        for poly in me.polygons:
            poly.use_smooth = True
    ob = link(bpy.data.objects.new(name, me))
    if m:
        assign(ob, m)
    return ob


def grid_surface(name, xs, ys, fz, m=None):
    """Superficie z=f(x,y) en una retícula."""
    nx, ny = len(xs), len(ys)
    X, Y = np.meshgrid(xs, ys, indexing="ij")
    Z = fz(X, Y)
    verts = np.stack([X, Y, Z], -1).reshape(-1, 3)
    faces = []
    for i in range(nx - 1):
        for j in range(ny - 1):
            a = i * ny + j
            faces.append((a, a + ny, a + ny + 1, a + 1))
    return mesh_obj(name, verts, faces, m)


def prim(kind, m=None, **kw):
    getattr(bpy.ops.mesh, f"primitive_{kind}_add")(**kw)
    ob = bpy.context.active_object
    if m:
        assign(ob, m)
    return ob


def smooth(ob, levels=2, bevel=None):
    if bevel:
        b = ob.modifiers.new("Bevel", "BEVEL")
        b.width = bevel
        b.segments = 4
        b.limit_method = "ANGLE"
    s = ob.modifiers.new("Sub", "SUBSURF")
    s.levels = levels
    s.render_levels = levels
    for p in ob.data.polygons:
        p.use_smooth = True
    return ob


def bevel(ob, width, segments=5):
    b = ob.modifiers.new("Bevel", "BEVEL")
    b.width = width
    b.segments = segments
    b.limit_method = "ANGLE"
    for p in ob.data.polygons:
        p.use_smooth = True
    try:
        ob.data.set_sharp_from_angle(angle=math.radians(35))
    except Exception:
        pass
    return ob


def area(name, loc, rot, size=(1, 1), energy=100, color=(1, 1, 1), shape="RECTANGLE", spread=None):
    ld = bpy.data.lights.new(name, "AREA")
    ld.shape = shape
    ld.size = size[0]
    ld.size_y = size[1]
    ld.energy = energy
    ld.color = color
    if spread is not None:
        ld.spread = math.radians(spread)
    ob = link(bpy.data.objects.new(name, ld))
    ob.location = loc
    ob.rotation_euler = Euler([math.radians(a) for a in rot])
    return ob


def point(name, loc, energy=50, color=(1, 1, 1), radius=0.05):
    ld = bpy.data.lights.new(name, "POINT")
    ld.energy = energy
    ld.color = color
    ld.shadow_soft_size = radius
    ob = link(bpy.data.objects.new(name, ld))
    ob.location = loc
    return ob


def spot(name, loc, target, energy=500, color=(1, 1, 1), angle=40, blend=0.6, radius=0.1):
    ld = bpy.data.lights.new(name, "SPOT")
    ld.energy = energy
    ld.color = color
    ld.spot_size = math.radians(angle)
    ld.spot_blend = blend
    ld.shadow_soft_size = radius
    ob = link(bpy.data.objects.new(name, ld))
    ob.location = loc
    look_at(ob, target)
    return ob


def look_at(ob, target):
    d = Vector(target) - ob.location
    ob.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


def camera(loc, target, lens=50, fstop=None, focus=None, sensor=36):
    cd = bpy.data.cameras.new("Cam")
    cd.lens = lens
    cd.sensor_width = sensor
    ob = link(bpy.data.objects.new("Cam", cd))
    ob.location = loc
    look_at(ob, target)
    if fstop:
        cd.dof.use_dof = True
        cd.dof.aperture_fstop = fstop
        cd.dof.focus_distance = focus if focus else (Vector(target) - Vector(loc)).length
    bpy.context.scene.camera = ob
    return ob


def floor(m, size=40, z=0.0):
    ob = prim("plane", m, size=size, location=(0, 0, z))
    return ob


def backdrop(m, z=0.0, depth=-6, height=8, width=30, radius=2.5):
    """Fondo infinito curvo de estudio."""
    xs = np.linspace(-width / 2, width / 2, 4)
    prof = []
    # tramo horizontal y curva hacia arriba
    for t in np.linspace(0, 1, 24):
        ang = t * math.pi / 2
        prof.append((depth + radius - math.sin(ang) * radius, z + radius - math.cos(ang) * radius))
    prof = [(8, z)] + prof + [(depth, z + height)]
    verts, faces = [], []
    for x in xs:
        for (y, zz) in prof:
            verts.append((x, y, zz))
    n = len(prof)
    for i in range(len(xs) - 1):
        for j in range(n - 1):
            a = i * n + j
            faces.append((a, a + 1, a + n + 1, a + n))
    return mesh_obj("Backdrop", verts, faces, m)


def tube_along(name, pts, radius, m, res=200):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = radius
    cu.bevel_resolution = 6
    cu.resolution_u = 24
    sp = cu.splines.new("NURBS")
    sp.points.add(len(pts) - 1)
    for p, c in zip(sp.points, pts):
        p.co = (*c, 1)
    sp.use_endpoint_u = True
    sp.order_u = min(4, len(pts))
    ob = link(bpy.data.objects.new(name, cu))
    ob.data.materials.append(m)
    return ob


def stone(name="Stone", tone=0.03, rough=0.7, scale=40, strength=0.25):
    return mat(name, color=(tone, tone, tone * 1.05), rough=rough, bump=(scale, strength, 12))


def pedestal(m, r=0.9, h=0.6, z=0.0):
    ob = prim("cylinder", m, vertices=128, radius=r, depth=h, location=(0, 0, z + h / 2))
    bevel(ob, 0.015)
    return ob


def studio_basic(key=600, rim=250, rim_color=ORANGE, rim_loc=(2.6, -1.8, 2.0), fill=0.0):
    area("Key", (-2.8, 2.6, 3.4), (-40, -38, 0), size=(3.2, 2.2), energy=key)
    area("Top", (0, 0.6, 4.8), (0, 0, 0), size=(2.5, 2.5), energy=key * 0.35)
    r = area("Rim", rim_loc, (0, 0, 0), size=(0.35, 2.2), energy=rim, color=rim_color)
    look_at(r, (0, 0, 0.9))
    if fill:
        area("Fill", (3.0, 3.5, 1.2), (70, 0, 140), size=(2, 2), energy=fill)


# ------------------------------------------------------------------ escenas

def car_panel(vertical=False):
    """Panel trasero de un deportivo negro mate: quiebre que sube, arco de rueda y una línea naranja."""
    blk = mat("Paint", color=(0.006, 0.006, 0.007), rough=0.45, coat=1.0, coat_rough=0.025, spec=0.5)

    def crease_y(X):
        return -0.05 + 0.32 * (np.tanh((X - 0.4) * 0.9) + 1) / 2

    def body(X, Y):
        yc = crease_y(X)
        shoulder = 0.62 * np.exp(-((Y - yc - 0.15) ** 2) / 1.1) - 0.1 * (X / 3.4) ** 2
        crease = 0.045 * np.tanh((Y - yc) * 26)
        haunch = 0.28 * np.exp(-(((X - 1.6) ** 2) / 1.4 + ((Y + 0.35) ** 2) / 0.55))
        lower = -0.3 * np.clip(-(Y + 0.6), 0, None) ** 1.3
        return shoulder + crease + haunch + lower

    xs = np.linspace(-3.6, 3.6, 480)
    ys = np.linspace(-1.9, 1.5, 300)
    nx, ny = len(xs), len(ys)
    X, Y = np.meshgrid(xs, ys, indexing="ij")
    Z = body(X, Y)
    verts = np.stack([X, Y, Z], -1).reshape(-1, 3)
    cx, cy, cr = 1.7, -1.95, 0.95  # arco de la rueda (recorte)
    faces = []
    for i in range(nx - 1):
        for j in range(ny - 1):
            mx, my = (xs[i] + xs[i + 1]) / 2, (ys[j] + ys[j + 1]) / 2
            if (mx - cx) ** 2 + (my - cy) ** 2 < cr ** 2:
                continue
            a_ = i * ny + j
            faces.append((a_, a_ + ny, a_ + ny + 1, a_ + 1))
    panel = mesh_obj("Panel", verts, faces, blk)
    sol = panel.modifiers.new("Thick", "SOLIDIFY")
    sol.thickness = 0.03
    panel.rotation_euler = (math.radians(90), 0, 0)
    panel.location = (0.0, 0, 1.3)
    # interior del arco: negro absoluto
    well = prim("cylinder", mat("Well", color=(0.002, 0.002, 0.002), rough=0.9), vertices=96, radius=cr - 0.02, depth=1.2,
                location=(cx, 0.75, cy + 1.3))
    well.rotation_euler = (math.radians(90), 0, 0)

    # línea naranja pegada al quiebre
    line_pts = []
    for x in np.linspace(-3.5, 3.5, 40):
        y = float(crease_y(np.array(x)))
        z = float(body(np.array(x), np.array(y))) + 0.008
        line_pts.append((x, -z, y + 1.3))
    tube_along("Crease", line_pts, 0.004, emit_mat("Line", ORANGE, 60))

    s1 = area("Soft1", (2.6, -4.2, 4.0), (0, 0, 0), size=(3.6, 0.32), energy=170)
    look_at(s1, (1.8, 0, 1.8))
    s2 = area("Soft2", (5.0, -2.2, 1.8), (0, 0, 0), size=(0.5, 4.5), energy=70)
    look_at(s2, (1.5, 0, 1.2))
    k = area("Kick", (4.8, 1.2, 0.9), (0, 0, 0), size=(0.25, 3.0), energy=90, color=ORANGE)
    look_at(k, (2.0, 0, 1.0))
    floor(mat("Floor", color=(0.003, 0.003, 0.003), rough=0.5, spec=0.4), z=0.0)

    if vertical:
        camera((-1.0, -3.2, 0.95), (1.2, 0, 1.85), lens=34, fstop=2.0, focus=3.3)
    else:
        camera((-2.0, -3.4, 1.4), (0.9, 0, 1.3), lens=40, fstop=1.8, focus=4.6)


def sand_material(name="Sand", ripple_scale=1.6, ripple_strength=0.55, tone=0.028):
    """Arena negra: ondas de viento (textura de bandas) + grano fino que brilla."""
    m = mat(name, color=(tone, tone, tone * 1.04), rough=0.78, spec=0.55)
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "X"
    wave.inputs["Scale"].default_value = ripple_scale
    wave.inputs["Distortion"].default_value = 7.0
    wave.inputs["Detail"].default_value = 3.0
    wave.inputs["Detail Scale"].default_value = 1.2
    nt.links.new(coord.outputs["Object"], wave.inputs["Vector"])
    grain = nt.nodes.new("ShaderNodeTexNoise")
    grain.inputs["Scale"].default_value = 1400
    grain.inputs["Detail"].default_value = 2
    nt.links.new(coord.outputs["Object"], grain.inputs["Vector"])
    b1 = nt.nodes.new("ShaderNodeBump")
    b1.inputs["Strength"].default_value = ripple_strength
    b1.inputs["Distance"].default_value = 0.05
    nt.links.new(wave.outputs["Fac"], b1.inputs["Height"])
    b2 = nt.nodes.new("ShaderNodeBump")
    b2.inputs["Strength"].default_value = 0.25
    nt.links.new(grain.outputs["Fac"], b2.inputs["Height"])
    nt.links.new(b1.outputs["Normal"], b2.inputs["Normal"])
    nt.links.new(b2.outputs["Normal"], p.inputs["Normal"])
    return m


def dunes(close=False, horizon=True):
    """Dunas de arena negra vistas desde el aire, ondas plateadas, brillo naranja tenue en el horizonte."""

    def h(X, Y):
        warp = 1.4 * np.sin(Y * 0.11 + 0.6) + 0.8 * np.sin(X * 0.07)
        ph = X * 0.16 + Y * 0.05 + warp
        crest = 1 - np.abs(np.sin(ph))  # crestas afiladas
        dune = 2.2 * crest ** 2.2 + 0.6 * np.sin(X * 0.05 - Y * 0.09)
        if close:  # macro: solo un oleaje suave, protagonismo de las ondas
            return 0.25 * np.sin(X * 0.35 + 0.8 * np.sin(Y * 0.3)) + 0.12 * np.sin(Y * 0.5)
        return dune

    span = 14 if close else 34
    n = 700 if close else 900
    xs = np.linspace(-span, span, n)
    ys = np.linspace(-span, span * (2.2 if horizon else 1.0), n)
    grid_surface("Dunes", xs, ys, h, sand_material(ripple_scale=2.4 if close else 1.2, ripple_strength=0.6 if close else 0.45))
    sun = bpy.data.lights.new("Sun", "SUN")
    sun.energy = 4.5
    sun.angle = math.radians(0.8)
    so = link(bpy.data.objects.new("Sun", sun))
    so.rotation_euler = Euler((math.radians(80), 0, math.radians(-115)))
    glow = bpy.data.lights.new("Glow", "SUN")
    glow.energy = 0.35 if horizon else 0.6
    glow.color = ORANGE
    glow.angle = math.radians(5)
    go = link(bpy.data.objects.new("Glow", glow))
    go.rotation_euler = Euler((math.radians(87), 0, math.radians(175)))
    w = bpy.context.scene.world.node_tree
    bg = w.nodes["Background"]
    coord = w.nodes.new("ShaderNodeTexCoord")
    sep = w.nodes.new("ShaderNodeSeparateXYZ")
    ramp = w.nodes.new("ShaderNodeValToRGB")
    w.links.new(coord.outputs["Generated"], sep.inputs[0])
    w.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    ramp.color_ramp.elements[0].position = 0.5
    ramp.color_ramp.elements[0].color = (0.1, 0.015, 0.0012, 1)
    ramp.color_ramp.elements[1].position = 0.515
    ramp.color_ramp.elements[1].color = (0.0004, 0.0004, 0.0005, 1)
    w.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    if close:
        camera((0, -10, 6.5), (0, 3.0, 0.5), lens=85, fstop=5.6)
        sun.energy = 5.0
        so.rotation_euler = Euler((math.radians(80), 0, math.radians(-100)))
        glow.energy = 0.0
        rim = area("OrangeRim", (14, 4.0, 0.9), (0, 0, 0), size=(1.0, 14), energy=9000, color=ORANGE)
        look_at(rim, (2.0, 3.0, 0.0))
    else:
        camera((0, -24, 10.5), (0, 30, -4.5), lens=45, fstop=11)


def frosted_pane(n=1):
    stone_m = stone("Ped", 0.035, 0.65, 30, 0.3)
    backdrop(mat("BD", color=(0.006, 0.006, 0.007), rough=0.7))
    pedestal(stone_m, r=1.0, h=0.55)
    g = glass("Frost", rough=0.28)
    if n == 1:
        p = prim("cube", g, size=1, location=(0, 0, 0.55 + 0.6))
        p.scale = (0.8, 0.035, 1.2)
        bevel(p, 0.012)
        p.rotation_euler = (0, 0, math.radians(-28))
    else:
        for i, (x, y, rz) in enumerate([(-0.55, 0.45, -18), (0.0, 0.0, -18), (0.55, -0.45, -18)]):
            p = prim("cube", g, size=1, location=(x, y, 1.25 + i * 0.16))
            p.scale = (0.55, 0.025, 0.72)
            p.rotation_euler = (0, 0, math.radians(rz))
            bevel(p, 0.01)
    area("Key", (-2.6, -2.2, 3.4), (0, 0, 0), size=(2.6, 2.6), energy=420)
    look_at(bpy.data.objects["Key"], (0, 0, 1.2))
    edge = area("Edge", (1.8, 1.6, 1.8), (0, 0, 0), size=(0.25, 2.4), energy=320, color=ORANGE)
    look_at(edge, (0, 0, 1.4))
    area("Back", (0, 3.2, 2.5), (0, 0, 0), size=(3, 1.2), energy=120)
    look_at(bpy.data.objects["Back"], (0, 0, 1.0))
    camera((2.4, -5.2, 2.2), (0, 0, 1.25), lens=58, fstop=2.8)


def shopping_bag():
    stone_m = stone("Ped", 0.035, 0.65, 30, 0.3)
    backdrop(mat("BD", color=(0.006, 0.006, 0.007), rough=0.7))
    pedestal(stone_m, r=1.1, h=0.5)
    paper = mat("Bag", color=(0.012, 0.012, 0.013), rough=0.62, bump=(160, 0.08, 6))
    bag = prim("cube", paper, size=1, location=(0, 0, 0.5 + 0.42))
    bag.scale = (0.78, 0.4, 0.84)
    bevel(bag, 0.006, 2)
    # boca abierta: restar una caja interior
    inner = prim("cube", None, size=1, location=(0, 0, 0.5 + 0.5))
    inner.scale = (0.76, 0.38, 0.84)
    bo = bag.modifiers.new("Hollow", "BOOLEAN")
    bo.object = inner
    bo.operation = "DIFFERENCE"
    inner.hide_render = True
    inner.hide_viewport = True
    # asas de cordón
    cord = mat("Cord", color=(0.01, 0.01, 0.01), rough=0.5)
    for y in (-0.16, 0.16):
        y = y * 1.2
        pts = [(-0.2, y, 1.32), (-0.18, y, 1.6), (0, y, 1.72), (0.18, y, 1.6), (0.2, y, 1.32)]
        tube_along(f"Handle{y}", pts, 0.011, cord)
    # papel de china naranja
    tissue = mat("Tissue", color=(0.95, 0.16, 0.008), rough=0.6, subsurface=0.15, bump=(30, 0.35, 10))
    rng = np.random.default_rng(5)
    for k in range(5):
        def crumple(X, Y, k=k):
            return 0.06 * np.sin(X * 9 + k) * np.cos(Y * 7 - k) + 0.03 * np.sin(X * 23 + Y * 17 + k * 2)
        t = grid_surface(f"Tissue{k}", np.linspace(-0.2, 0.2, 60), np.linspace(-0.17, 0.17, 50), crumple, tissue)
        t.rotation_euler = (math.radians(70 + rng.uniform(-25, 25)), math.radians(rng.uniform(-30, 30)), math.radians(k * 72))
        t.location = (rng.uniform(-0.22, 0.22), rng.uniform(-0.06, 0.06), 1.36 + rng.uniform(0, 0.1))
        sol = t.modifiers.new("Sol", "SOLIDIFY")
        sol.thickness = 0.004
    studio_basic(key=520, rim=220, rim_loc=(2.4, 1.6, 2.4))
    camera((2.0, -4.4, 1.75), (0, 0, 1.05), lens=60, fstop=2.8)


def desk_clock():
    stone_m = stone("Slab", 0.032, 0.6, 26, 0.3)
    slab = prim("cube", stone_m, size=1, location=(0, 0, 0.15))
    slab.scale = (2.4, 1.4, 0.15)
    bevel(slab, 0.01)
    backdrop(mat("BD", color=(0.006, 0.006, 0.007), rough=0.7))
    body_m = mat("Clock", color=(0.015, 0.015, 0.016), rough=0.38, metal=0.0, coat=0.6, coat_rough=0.1)
    body = prim("cylinder", body_m, vertices=128, radius=0.62, depth=0.22, location=(0, 0, 0.3 + 0.6))
    body.rotation_euler = (math.radians(90), 0, 0)
    bevel(body, 0.03, 6)
    face = prim("cylinder", mat("Face", color=(0.02, 0.02, 0.021), rough=0.7), vertices=128, radius=0.54, depth=0.01, location=(0, -0.112, 0.92))
    face.rotation_euler = (math.radians(90), 0, 0)
    tick = mat("Tick", color=(0.5, 0.5, 0.52), rough=0.35, metal=1.0)
    for i in range(12):
        a = i / 12 * math.tau
        t = prim("cube", tick, size=1, location=(math.sin(a) * 0.46, -0.12, 0.92 + math.cos(a) * 0.46))
        t.scale = (0.008, 0.004, 0.05 if i % 3 == 0 else 0.028)
        t.rotation_euler = (0, -a, 0)
    def hand(length, width, angle, m, y):
        hnd = prim("cube", m, size=1, location=(0, y, 0.92))
        hnd.scale = (width, 0.003, length / 2)
        hnd.location.x += math.sin(angle) * length / 2 - math.sin(angle) * 0.04
        hnd.location.z += math.cos(angle) * length / 2 - math.cos(angle) * 0.04
        hnd.rotation_euler = (0, -angle, 0)
    hand(0.32, 0.012, math.radians(305), tick, -0.125)
    hand(0.42, 0.008, math.radians(62), tick, -0.13)
    hand(0.48, 0.0035, math.radians(160), emit_mat("Sec", ORANGE, 30), -0.136)
    prim("cylinder", tick, vertices=32, radius=0.018, depth=0.03, location=(0, -0.13, 0.92)).rotation_euler = (math.radians(90), 0, 0)
    leg = prim("cube", body_m, size=1, location=(0, 0.02, 0.345))
    leg.scale = (0.5, 0.3, 0.09)
    bevel(leg, 0.01)
    studio_basic(key=520, rim=200, rim_loc=(2.2, 1.8, 2.0))
    fl = area("FaceLight", (-0.8, -3.0, 1.6), (0, 0, 0), size=(1.2, 1.2), energy=70)
    look_at(fl, (0, 0, 0.92))
    camera((1.3, -4.0, 1.25), (0, 0, 0.86), lens=75, fstop=2.4)


def glass_cube_sphere(small=False):
    stone_m = stone("Base", 0.025, 0.55, 30, 0.25)
    backdrop(mat("BD", color=(0.005, 0.005, 0.006), rough=0.7))
    if small:
        slab = prim("cube", stone_m, size=1, location=(0, 0, 0.1))
        slab.scale = (3, 2, 0.1)
        z0 = 0.2
        s = 0.55
    else:
        pedestal(stone_m, r=1.05, h=0.5)
        z0 = 0.5
        s = 0.62
    cube = prim("cube", glass("Frost", rough=0.34 if small else 0.18), size=1, location=(0, 0, z0 + s + 0.02))
    cube.scale = (s, s, s)
    bevel(cube, 0.03, 6)
    cube.rotation_euler = (0, 0, math.radians(32))
    if small:
        core = prim("cube", emit_mat("Core", ORANGE, 1.5), size=1, location=(0, 0, z0 + s + 0.02))
        core.scale = (0.17, 0.17, 0.17)
        core.rotation_euler = (0, 0, math.radians(32))
        bevel(core, 0.012, 4)
    else:
        prim("uv_sphere", emit_mat("Core", ORANGE, 1.3), segments=96, ring_count=48, radius=0.26, location=(0, 0, z0 + s + 0.02))
        for p in bpy.context.active_object.data.polygons:
            p.use_smooth = True
    point("CoreLight", (0, 0, z0 + s + 0.02), energy=6 if small else 35, color=ORANGE, radius=0.2)
    area("Key", (-2.8, -2.4, 3.6), (0, 0, 0), size=(2.6, 2.6), energy=300)
    look_at(bpy.data.objects["Key"], (0, 0, 1.0))
    area("Back", (0.5, 3.4, 2.8), (0, 0, 0), size=(3, 1.2), energy=110)
    look_at(bpy.data.objects["Back"], (0, 0, 1.0))
    camera((2.6, -5.0, 2.3), (0, 0, z0 + s), lens=60, fstop=2.8)


def gear_mesh(name, r, teeth, depth, m, hole=0.35, spokes=0):
    bm = bmesh.new()
    n = teeth * 4
    outer = []
    for i in range(n):
        a = i / n * math.tau
        k = i % 4
        rr = r * 1.13 if k in (1, 2) else r
        da = (0.022 if k in (1, 3) else -0.022) * (12 / teeth)
        outer.append(bm.verts.new((math.cos(a + da) * rr, math.sin(a + da) * rr, 0)))
    f = bm.faces.new(outer)
    ret = bmesh.ops.extrude_face_region(bm, geom=[f])
    vs = [e for e in ret["geom"] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=vs, vec=(0, 0, depth))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = link(bpy.data.objects.new(name, me))
    assign(ob, m)
    cut = prim("cylinder", None, vertices=96, radius=r * hole, depth=depth * 3, location=(0, 0, depth / 2))
    bo = ob.modifiers.new("Hole", "BOOLEAN")
    bo.object = cut
    bo.operation = "DIFFERENCE"
    cut.hide_render = True
    cut.hide_viewport = True
    cut.parent = ob
    if spokes:
        for s in range(spokes):
            a = s / spokes * math.tau + 0.4
            w = prim("cylinder", None, vertices=48, radius=r * 0.18, depth=depth * 3, location=(math.cos(a) * r * 0.62, math.sin(a) * r * 0.62, depth / 2))
            b2 = ob.modifiers.new(f"S{s}", "BOOLEAN")
            b2.object = w
            b2.operation = "DIFFERENCE"
            w.hide_render = True
            w.hide_viewport = True
            w.parent = ob
    bevel(ob, depth * 0.08, 3)
    return ob


def watch_gears():
    metal = mat("Steel", color=(0.07, 0.07, 0.075), rough=0.32, metal=1.0, bump=(400, 0.03, 4))
    orange_metal = mat("Orange", color=(0.95, 0.2, 0.02), rough=0.3, metal=0.6)
    plate = prim("plane", mat("Plate", color=(0.02, 0.02, 0.022), rough=0.4, metal=1.0, bump=(1200, 0.06, 3)), size=20, location=(0, 0, -0.05))
    gears = [
        (0.0, 0.0, 1.1, 36, metal, 5), (1.72, 0.65, 0.6, 20, orange_metal, 4), (-1.55, 1.05, 0.72, 24, metal, 5),
        (-0.6, -1.65, 0.55, 18, metal, 0), (1.1, -1.5, 0.42, 14, metal, 0), (2.6, -0.6, 0.85, 28, metal, 5),
    ]
    for i, (x, y, r, t, m, sp) in enumerate(gears):
        g = gear_mesh(f"G{i}", r, t, 0.08 + (i % 3) * 0.04, m, hole=0.16, spokes=sp)
        g.location = (x, y, (i % 3) * 0.06)
        g.rotation_euler = (0, 0, i * 0.37)
        pin = prim("cylinder", mat(f"Jewel{i}", color=(0.02, 0.02, 0.02), rough=0.1, metal=1.0), vertices=48, radius=r * 0.14, depth=0.35, location=(x, y, 0.1))
    area("Key", (-3.0, -2.0, 4.5), (0, 0, 0), size=(3, 3), energy=520)
    look_at(bpy.data.objects["Key"], (0, 0, 0))
    area("Strip", (3.5, 2.5, 2.2), (0, 0, 0), size=(0.3, 4), energy=260)
    look_at(bpy.data.objects["Strip"], (0, 0, 0))
    area("Rim", (2.5, -3.2, 1.0), (0, 0, 0), size=(0.3, 2.5), energy=160, color=ORANGE)
    look_at(bpy.data.objects["Rim"], (1.5, 0.5, 0))
    camera((0.6, -4.2, 3.6), (0.5, 0.0, 0.0), lens=60, fstop=2.2, focus=5.55)


def magnifier():
    stone_m = stone("Rock", 0.05, 0.75, 9, 1.2)
    rock = grid_surface("Rock", np.linspace(-6, 6, 500), np.linspace(-4, 5, 400),
                        lambda X, Y: 0.03 * np.sin(X * 3.1 + np.sin(Y * 2.3)) + 0.02 * np.sin(Y * 5.7 + X), stone_m)
    lens_m = glass("Lens", rough=0.0)
    lens = prim("uv_sphere", lens_m, segments=128, ring_count=64, radius=1.0, location=(0.3, 0.2, 0.9))
    lens.scale = (0.85, 0.85, 0.09)
    for p in lens.data.polygons:
        p.use_smooth = True
    ring_m = mat("Ring", color=(0.03, 0.03, 0.032), rough=0.25, metal=1.0)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.86, minor_radius=0.05, major_segments=128, minor_segments=24, location=(0.3, 0.2, 0.9))
    ring = bpy.context.active_object
    assign(ring, ring_m)
    for p in ring.data.polygons:
        p.use_smooth = True
    handle = prim("cylinder", mat("Handle", color=(0.015, 0.015, 0.016), rough=0.5), vertices=48, radius=0.07, depth=1.6, location=(1.55, -1.05, 0.9))
    handle.rotation_euler = (0, math.radians(90), math.radians(-40))
    bevel(handle, 0.02)
    for o in (lens, ring):
        o.rotation_euler = (math.radians(-8), math.radians(6), 0)
    area("Key", (-2.8, -1.5, 4), (0, 0, 0), size=(3, 3), energy=700)
    look_at(bpy.data.objects["Key"], (0, 0, 0))
    st = area("Strip", (3.2, -0.5, 2.2), (0, 0, 0), size=(0.3, 3.0), energy=220)
    look_at(st, (0.3, 0.2, 0.9))
    ref = prim("cube", emit_mat("GlintCard", ORANGE, 6), size=1, location=(1.4, -3.0, 4.2))
    ref.scale = (0.5, 0.05, 0.12)
    look_at(ref, (0.3, 0.2, 0.9))
    glint = area("Glint", (-1.6, 2.6, 2.6), (0, 0, 0), size=(0.1, 0.5), energy=160, color=ORANGE, spread=15)
    look_at(glint, (0.3, 0.2, 0.9))
    camera((-0.4, -4.4, 3.4), (0.4, 0.2, 0.5), lens=58, fstop=2.4, focus=5.1)


def swatches():
    stone_m = stone("Rock", 0.028, 0.75, 10, 0.6)
    prim("plane", stone_m, size=30, location=(0, 0, 0))
    cols = [((0.82, 0.83, 0.84), 0.55), ((0.04, 0.04, 0.045), 0.5), ((0.95, 0.18, 0.015), 0.45)]
    for i, (c, rough) in enumerate(cols):
        card = prim("cube", mat(f"Card{i}", color=c, rough=rough, bump=(250, 0.04, 4)), size=1, location=(0, 0, 0.012 + i * 0.008))
        card.scale = (0.75, 1.15, 0.008)
        bevel(card, 0.006, 3)
        card.rotation_euler = (0, 0, math.radians(-24 + i * 16))
        card.location.x = -0.55 + i * 0.5
        card.location.y = 0.12 - i * 0.12
    area("Key", (-2.2, -1.8, 3.8), (0, 0, 0), size=(2.5, 2.5), energy=330)
    look_at(bpy.data.objects["Key"], (0, 0, 0))
    area("Rim", (2.6, 2.4, 1.2), (0, 0, 0), size=(0.3, 2.5), energy=150, color=ORANGE)
    look_at(bpy.data.objects["Rim"], (0.2, 0, 0))
    camera((0.9, -3.2, 2.6), (0.1, 0.05, 0.0), lens=55, fstop=2.0, focus=4.1)


def light_trail():
    w = bpy.context.scene.world.node_tree
    vol = w.nodes.new("ShaderNodeVolumePrincipled")
    vol.inputs["Density"].default_value = 0.02
    w.links.new(vol.outputs[0], w.nodes["World Output"].inputs["Volume"])
    prim("plane", mat("Ground", color=(0.01, 0.01, 0.01), rough=0.35, bump=(40, 0.2, 8)), size=40, location=(0, 0, 0))
    pts = []
    for i, t in enumerate(np.linspace(0, 1, 40)):
        pts.append((0.25 * math.sin(t * 5.0) * (1 - t * 0.5), 0.1 * math.cos(t * 4), 0.05 + t * 7.5))
    tube_along("Trail", pts, 0.012, emit_mat("Trail", ORANGE, 9))
    pts2 = [(x + 0.05, y - 0.02, z) for (x, y, z) in pts]
    tube_along("Trail2", pts2, 0.05, emit_mat("Halo", ORANGE, 0.8))
    point("Glow", (0, 0, 1.2), energy=90, color=ORANGE, radius=0.4)
    point("Glow2", (0, 0, 4.5), energy=60, color=ORANGE, radius=0.4)
    area("Back", (0, 6, 4), (0, 0, 0), size=(6, 6), energy=260)
    look_at(bpy.data.objects["Back"], (0, 0, 3))
    bpy.context.scene.cycles.volume_step_rate = 4
    camera((0.0, -8.5, 2.6), (0, 0, 3.4), lens=42, fstop=4.0)


def ui_texture(path, w=1200, h=700):
    """Interfaz abstracta para el monitor (sin letras)."""
    img = np.zeros((h, w, 4), np.float32)
    img[..., :3] = 0.012
    img[..., 3] = 1
    rng = np.random.default_rng(11)
    img[0:56, :, :3] = 0.03
    img[20:36, 40:200, :3] = 0.55
    for i in range(5):
        img[22:34, 760 + i * 80:820 + i * 80, :3] = 0.18
    img[120:170, 70:560, :3] = 0.8
    img[190:240, 70:440, :3] = 0.8
    img[280:295, 70:500, :3] = 0.25
    img[310:325, 70:430, :3] = 0.25
    img[380:440, 70:270, :3] = (1.0, 0.2, 0.02)
    gx = np.linspace(0, 1, 470)
    for y in range(110, 520):
        t = (y - 110) / 410
        img[y, 640:1110, :3] = np.stack([0.05 + 0.6 * gx * (1 - t), 0.03 + 0.08 * gx * (1 - t), 0.02 + 0.01 * gx], -1)
    for i in range(3):
        x0 = 70 + i * 360
        img[560:680, x0:x0 + 330, :3] = 0.035
        img[590:620, x0 + 24:x0 + 60, :3] = (1.0, 0.2, 0.02)
        img[640:652, x0 + 24:x0 + 220, :3] = 0.2
    bimg = bpy.data.images.new("UI", w, h)
    bimg.pixels = img[::-1].ravel()
    bimg.filepath_raw = path
    bimg.file_format = "PNG"
    bimg.save()
    return bimg


def workspace(out_dir):
    concrete = mat("Concrete", color=(0.03, 0.03, 0.032), rough=0.9, bump=(18, 0.5, 14))
    wall = prim("plane", concrete, size=30, location=(0, 1.2, 4))
    wall.rotation_euler = (math.radians(90), 0, 0)
    desk_m = mat("Desk", color=(0.02, 0.018, 0.017), rough=0.35, bump=(200, 0.02, 3))
    desk = prim("cube", desk_m, size=1, location=(0, -0.3, 0.74))
    desk.scale = (2.6, 0.75, 0.025)
    bevel(desk, 0.008)
    floor(mat("Floor", color=(0.008, 0.008, 0.009), rough=0.6))
    ui = ui_texture(f"{out_dir}/_ui.png")
    scr = bpy.data.materials.new("Screen")
    scr.use_nodes = True
    nt = scr.node_tree
    for n in list(nt.nodes):
        if n.type == "BSDF_PRINCIPLED":
            nt.nodes.remove(n)
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = ui
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Strength"].default_value = 2.2
    nt.links.new(tex.outputs["Color"], em.inputs["Color"])
    nt.links.new(em.outputs[0], nt.nodes["Material Output"].inputs["Surface"])
    frame_m = mat("Frame", color=(0.012, 0.012, 0.013), rough=0.3, metal=1.0)
    mon = prim("cube", frame_m, size=1, location=(-0.15, 0.3, 1.32))
    mon.scale = (0.86, 0.025, 0.5)
    bevel(mon, 0.01)
    bpy.ops.mesh.primitive_plane_add(size=1, location=(-0.15, 0.274, 1.32))
    screen = bpy.context.active_object
    screen.scale = (1.66, 0.96, 1)
    screen.rotation_euler = (math.radians(90), 0, 0)
    assign(screen, scr)
    stand = prim("cube", frame_m, size=1, location=(-0.15, 0.36, 0.95))
    stand.scale = (0.04, 0.03, 0.2)
    base = prim("cube", frame_m, size=1, location=(-0.15, 0.3, 0.77))
    base.scale = (0.22, 0.14, 0.008)
    kb = prim("cube", mat("Kb", color=(0.02, 0.02, 0.02), rough=0.5), size=1, location=(-0.2, -0.45, 0.78))
    kb.scale = (0.45, 0.14, 0.012)
    bevel(kb, 0.006)
    # lámpara de escritorio
    lamp_m = mat("Lamp", color=(0.015, 0.015, 0.016), rough=0.35, metal=1.0)
    prim("cylinder", lamp_m, vertices=64, radius=0.12, depth=0.025, location=(1.05, 0.05, 0.77))
    tube_along("Arm", [(1.05, 0.05, 0.78), (1.0, 0.1, 1.35), (0.8, 0.0, 1.6), (0.62, -0.1, 1.52)], 0.012, lamp_m)
    shade = prim("cone", lamp_m, vertices=64, radius1=0.13, radius2=0.04, depth=0.2, location=(0.6, -0.12, 1.47))
    shade.rotation_euler = (math.radians(20), math.radians(-35), 0)
    sp = spot("LampLight", (0.58, -0.13, 1.42), (0.35, -0.35, 0.75), energy=2200, color=ORANGE, angle=80, blend=0.8, radius=0.04)
    point("Bulb", (0.58, -0.13, 1.43), energy=8, color=ORANGE, radius=0.03)
    area("Ambient", (-3, -3, 3), (0, 0, 0), size=(3, 3), energy=90)
    look_at(bpy.data.objects["Ambient"], (0, 0, 1))
    area("ScreenSpill", (-0.15, -0.2, 1.32), (0, 0, 0), size=(1.6, 0.9), energy=25, color=(0.9, 0.85, 0.8))
    look_at(bpy.data.objects["ScreenSpill"], (-0.15, -2, 1.0))
    cup = prim("cylinder", mat("Cup", color=(0.5, 0.5, 0.5), rough=0.4), vertices=64, radius=0.045, depth=0.11, location=(0.95, -0.5, 0.81))
    wash = spot("WallWash", (-0.2, -0.6, 3.2), (-0.2, 1.2, 1.6), energy=900, color=(1, 1, 1), angle=60, blend=1.0, radius=0.3)
    camera((0.45, -2.75, 1.4), (0.25, 0.0, 1.1), lens=35, fstop=2.8)


def cable():
    rng = np.random.default_rng(9)

    def sand_h(X, Y):
        return 0.012 * np.sin(X * 14 + np.sin(Y * 3)) + 0.006 * np.sin(Y * 23 + X * 4)

    sand = mat("Sand", color=(0.025, 0.025, 0.027), rough=0.9, bump=(700, 0.4, 8))
    grid_surface("Sand", np.linspace(-5, 5, 500), np.linspace(-4, 6, 500), sand_h, sand)
    cab = mat("Cable", color=(0.012, 0.012, 0.013), rough=0.35, coat=0.6)
    pts = [(-4, 2.6, 0.05), (-2.6, 1.6, 0.06), (-1.4, 0.4, 0.06), (-0.6, -0.1, 0.06), (0.15, 0.0, 0.07)]
    tube_along("Cable", pts, 0.05, cab)
    plug_m = mat("Plug", color=(0.014, 0.014, 0.015), rough=0.3, metal=0.2, coat=0.6)
    plug = prim("cylinder", plug_m, vertices=64, radius=0.085, depth=0.38, location=(0.32, 0.03, 0.09))
    plug.rotation_euler = (0, math.radians(90), math.radians(4))
    bevel(plug, 0.015)
    tip = prim("cylinder", emit_mat("Tip", ORANGE, 1.4), vertices=64, radius=0.086, depth=0.03, location=(0.52, 0.045, 0.09))
    tip.rotation_euler = (0, math.radians(90), math.radians(4))
    pin_m = mat("Pin", color=(0.6, 0.6, 0.62), rough=0.2, metal=1.0)
    for dy in (-0.03, 0.03):
        pn = prim("cube", pin_m, size=1, location=(0.6, 0.045 + dy, 0.09))
        pn.scale = (0.07, 0.006, 0.018)
    point("TipGlow", (0.62, 0.05, 0.12), energy=6, color=ORANGE, radius=0.05)
    area("Key", (-2.5, -2.0, 3.0), (0, 0, 0), size=(2.4, 2.4), energy=160)
    look_at(bpy.data.objects["Key"], (0, 0, 0))
    area("Rim", (1.8, 2.5, 0.6), (0, 0, 0), size=(0.3, 2), energy=60)
    look_at(bpy.data.objects["Rim"], (0.2, 0, 0))
    camera((1.5, -2.2, 1.1), (0.2, 0.15, 0.05), lens=60, fstop=1.8, focus=2.7)


SCENES = {
    "hero": lambda o: car_panel(False),
    "hero-m": lambda o: car_panel(True),
    "dunes": lambda o: dunes(False),
    "cta": lambda o: dunes(True, horizon=False),
    "landing": lambda o: frosted_pane(1),
    "sitio": lambda o: frosted_pane(3),
    "tienda": lambda o: shopping_bag(),
    "citas": lambda o: desk_clock(),
    "agente": lambda o: glass_cube_sphere(False),
    "mantenimiento": lambda o: watch_gears(),
    "diagnostico": lambda o: magnifier(),
    "sandbox": lambda o: glass_cube_sphere(True),
    "marca": lambda o: swatches(),
    "lanzamiento": lambda o: light_trail(),
    "historia": lambda o: workspace(o),
    "404": lambda o: cable(),
}

if __name__ == "__main__":
    name, w, h, samples, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
    random.seed(1)
    reset(w, h, samples)
    import os
    SCENES[name](os.path.dirname(out))
    bpy.context.scene.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print("OK", name)
