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
