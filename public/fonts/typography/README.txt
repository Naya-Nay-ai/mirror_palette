Typography comparison fonts

Palette Mincho Comparison is a fixed-heading subset of Honoka Mincho (2014),
NOT Honoka Shin Mincho. Glyph outlines and advance widths are unchanged.
The subset contains only characters used in these three headings:
編集中のコーデ / マイアイテム / 保存したコーデ
The font was renamed for redistribution as a derivative.

Copyright (C) Information-technology Promotion Agency, Japan (IPA), 2003-2013.
Copyright (C) 2014 HONOKA Project.
License: IPA Font License Agreement v1.0; see IPA-LICENSE.txt in this directory.
This license applies to the derived font and build-subset.py.

Source and complete upstream distribution:
https://font.gloomy.jp/honoka-mincho-dl-oldver.html
https://font.gloomy.jp/dl-font-s5a4ik5w/honoka-min.zip
The archive contains font_1_honokamin.ttf, the original IPAex Mincho
ipaexfont/ipaexm.ttf, the IPA license, and upstream documentation.

The derivative is supplied as palette-mincho-comparison.woff beside this file.
The additional build file is build-subset.py beside this file.
To reproduce it, install fonttools and run:
python build-subset.py font_1_honokamin.ttf palette-mincho-comparison.woff

Replacement with the original IPA-licensed program (IPAex Mincho):
1. Download and extract the upstream archive linked above.
2. Copy ipaexfont/ipaexm.ttf into public/fonts/typography/ipaexm.ttf.
3. In src/app/globals.css, replace the Palette Mincho Comparison @font-face src
   with url("/fonts/typography/ipaexm.ttf") format("truetype").
   Change that @font-face family and the three heading selectors to "IPAexMincho".
4. Rebuild the app. This uses the unmodified original IPAex Mincho in place of
   the derivative. Keep the IPA license with the redistributed font.
Alternatively install ipaexm.ttf and override the three headings' font-family
with "IPAexMincho" in the browser's user stylesheet.

Japanese heading comparison: Shippori Mincho B1
The active Japanese heading font in this comparison is Shippori Mincho B1
Regular (400), from the Google Fonts distribution maintained from FONTDASU's
ShipporiMincho project. The Honoka files above are retained from the parent.
Only these headings use this font:
編集中のコーデ / マイアイテム / 保存したコーデ
The 16 heading characters are subsetted without changing their outlines or
advance widths and served from this site's /fonts/typography/ directory.
There are no runtime requests to Google Fonts or another font CDN.

Copyright 2021 The Shippori Mincho Project Authors
(https://github.com/fontdasu/ShipporiMincho)
License: SIL Open Font License 1.1; see Shippori-Mincho-B1-OFL.txt.
Source:
https://github.com/google/fonts/tree/main/ofl/shipporiminchob1
https://raw.githubusercontent.com/google/fonts/main/ofl/shipporiminchob1/ShipporiMinchoB1-Regular.ttf
Source font version: 3.110.
To reproduce with fonttools:
python -m fontTools.subset ShipporiMinchoB1-Regular.ttf --text="編集中のコーデマイアイテム保存した" --flavor=woff --name-IDs="*" --name-languages="*" --name-legacy --layout-features="*" --output-file=shippori-mincho-b1-headings.woff

Cinzel variable font: Copyright 2020 The Cinzel Project Authors.
https://github.com/NDISCOVER/Cinzel
Source: https://github.com/google/fonts/tree/main/ofl/cinzel
License: SIL Open Font License 1.1 (Cinzel-OFL.txt).
The WOFF file is a lossless compression of the source TTF with its metadata.
