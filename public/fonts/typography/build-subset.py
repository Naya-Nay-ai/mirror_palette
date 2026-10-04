# SPDX-License-Identifier: IPA
# Build a fixed-heading subset of Honoka Mincho (2014), an IPAex Mincho derivative.
# The resulting font is licensed under IPA Font License Agreement v1.0.
# Requires fonttools. Usage: python build-subset.py SOURCE.ttf OUTPUT.woff
import sys
from fontTools import subset
from fontTools.ttLib import TTFont
font = TTFont(sys.argv[1])
options = subset.Options()
options.name_IDs = ["*"]
options.name_languages = ["*"]
options.name_legacy = True
options.layout_features = ["*"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(text="編集中のコーデマイアイテム保存した")
subsetter.subset(font)
names = {1: "Palette Mincho Comparison", 2: "Regular",
         3: "PaletteMinchoComparison-Regular-1.0",
         4: "Palette Mincho Comparison Regular", 6: "PaletteMinchoComparison-Regular",
         16: "Palette Mincho Comparison", 17: "Regular"}
for record in font["name"].names:
    if record.nameID in names:
        record.string = names[record.nameID].encode(record.getEncoding())
font.flavor = "woff"
font.save(sys.argv[2])
