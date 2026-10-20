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

Cinzel variable font: Copyright 2020 The Cinzel Project Authors.
https://github.com/NDISCOVER/Cinzel
Source: https://github.com/google/fonts/tree/main/ofl/cinzel
License: SIL Open Font License 1.1 (Cinzel-OFL.txt).
The WOFF file is a lossless compression of the source TTF with its metadata.

Shippori Antique + Zen Kaku Gothic New comparison (2026-10-20)
Base commit: fb94d7a31143292d0088f2fcdc76a0abb40c03da
Branch: compare/typography-antique-zen

Shippori Antique (standard version, not B1) is used only for:
編集中のコーデ / マイアイテム / 保存したコーデ
Official upstream: https://github.com/fontdasu/ShipporiAntique
Official Google Fonts distribution: https://github.com/google/fonts/tree/main/ofl/shipporiantique
Self-hosted package: @fontsource/shippori-antique 5.3.0, Regular 400.
Copyright 2020 The Shippori Antique Project Authors.
License: SIL Open Font License 1.1; see ShipporiAntique-OFL.txt.

Zen Kaku Gothic New replaces the previous Noto Sans JP UI/body family.
Official upstream: https://github.com/googlefonts/zen-kakugothic
Official Google Fonts distribution: https://github.com/google/fonts/tree/main/ofl/zenkakugothicnew
Self-hosted package: @fontsource/zen-kaku-gothic-new 5.3.1, weights 400/500/700.
Copyright 2022 The Zen Project Authors.
License: SIL Open Font License 1.1; see ZenKakuGothicNew-OFL.txt.
Existing CSS weights are retained; requests for 600 use the closest supplied
weight (700) through standard CSS font matching.

The pinned packages include unedited font files, metadata and copyright notices.
Their WOFF2 assets are bundled and served by this app, with no Google Fonts/CDN
stylesheet requests at runtime. Full license texts are copied beside this file.
Cinzel, its existing size/position, and Cormorant Garamond for Your palette remain
unchanged. No copy, sizing, spacing, colors, garment or storage behavior changes.
