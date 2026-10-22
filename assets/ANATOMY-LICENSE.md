# Dental anatomy assets

**Anatomy from 3Dentes by Nate Saindon, CC BY-NC 4.0.**

- Source: https://github.com/NateSaindon/3Dentes
- License: https://creativecommons.org/licenses/by-nc/4.0/
- Source directory: `assets/cbct/stl/`.
- Isolated molar/incisor: `FMA55698{,-enamel,-pulp}.stl` and
  `FMA55681{,-enamel,-pulp}.stl`; additional teeth `FMA55798.stl` and `FMA55689.stl`.
- Upper arch, in FDI order 17–11 then 21–27:
  `FMA55697`, `FMA55698`, `FMA55688`, `FMA55689`, `FMA55798`, `FMA55680`,
  `FMA55681`, `FMA55682`, `FMA55683`, `FMA55799`, `FMA55690`, `FMA55691`,
  `FMA55699`, `FMA55700`; gingival surface `FMA59763` (all `.stl`).
- Source describes the donor as the repository author and supplies consent for
  publication. These assets represent one individual's anatomy, not a normal
  form applicable to every tooth or a scan of the fictional patient.
- Changes in odontoxiii v5: isolated teeth share one rigid principal-axis
  orientation across their layers, then centering and uniform scaling; the
  arch uses one rigid rotation, centering and uniform scale for all 14 distinct
  teeth and the gingival mesh. Original relative tooth positions are retained.
  No representative tooth is repeated around an artificial arch.
- Additional changes: 0.0001 display-unit quantization, exact vertex welding,
  computed smooth normals and display colors. The normalized units do not
  support clinical measurements. Principal axes are approximate presentation
  axes, not manually verified dental anatomical planes.
- Outer tooth and pulp geometry are CBCT-derived. Enamel thickness in the source
  is an approximation derived from literature. Pulp was manually segmented.
  Gingiva is a derived surface, not measured soft tissue. Details smaller than
  the scan resolution may be absent. The shared arch is not clipped by an
  artificial horizontal cervical plane.
- Cut/exploded teaching geometry, lesion and treatment colors, and instruments
  are separate educational illustrations. Reflection is an optical rendering
  effect; instruments do not simulate tissue forces, dosage or puncture.
- These assets are for **noncommercial** use with attribution and remain under
  their own license. They are not covered by the application code license.

No endorsement by the creator is implied. Dundee models and clinical photographs
are separate external references: see `REFERENCE-SOURCES.md`.

## v8 native tooth-interior study

The primary Atlas study retains the same source outer tooth and segmented pulp
in whole, cut and separated views. Outer surface triangles are partitioned at a
cervical plane inferred from the source enamel envelope. The dentin core is an
closed teaching volume generated from the source interior on a 0.045 display-unit
grid. Ray-parity voxelization, a smoothed inward-distance field and marching
tetrahedra and eight local smoothing passes produce conservative internal surfaces.
Preparation checks that smoothed vertices remain inside the source volume and
that each core edge belongs to exactly two faces. The distance threshold varies
between roots and crown; no offset source triangles are used. `tools/pack-study-core.py`
records the preparation method. The resulting enamel,
dentin and cementum boundaries are **illustrative**, not measured histology or
clinically validated segmentation. Source pulp is preserved. Clipping adds
triangulated section faces; display colors identify tissues. Lesion mode remains
a separate schematic geometry and is labeled accordingly.

The MSD/BioDigital tooth model is an external reference linked on its original
page. Its meshes, images, customer widget and licensing are not copied into this
application. BioDigital publishing conditions were checked against
https://support.biodigital.com/hc/en-us/articles/225773768-Publish-a-3D-model
and https://support.biodigital.com/hc/en-us/articles/360000055447-What-subscriptions-do-you-offer.
