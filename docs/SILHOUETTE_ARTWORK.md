# シルエット監修素材の差し替え

対象は My styling のマネキンと服だけです。編集UI・選択サムネイル・Saved looks・保存データは変更しません。素材がない種類は現在のSVGをそのまま表示します。

## 素材を描くとき

- 透過PNG、または外部参照を含まないSVGを使います。
- 共通キャンバスは **360 × 580**。PNGは同じ比率の **1080 × 1740 px** でも構いません。
- マネキン・Top・Bottom・Shoesを同じキャンバス上に重ねて位置を合わせ、各レイヤーを**余白を残したまま**別々に書き出します。靴は左右1組です。
- 現在の表示範囲は x=65〜295、y=28〜573。描画がこの範囲を超えると、既存の表示枠で切れます。
- 色変更する服は、服の面を不透明な単色で塗り、背景・首元の穴・左右の脚の隙間などを透明にします。黒でも白でもよく、**透明度だけ**を輪郭として使います。
- 輪郭の内側は不透明にしてください。内側が半透明だと下地が透け、指定HEXと見え方が変わります。輪郭のアンチエイリアスは使用できます。
- 襟・縫い目・ボタン・固定色のソールなどは、必要なら同じサイズの別の透過線画にします。塗り面に描き込んだ線はマスク化すると消えます。
- マネキンは色付き透過画像1枚で登録できます。服の塗り面と線画を分離した元データも保管してください。

今の人体形状を監修の基準に固定する必要はありません。新しいマネキンと服を同じキャンバスで揃えれば、まとめて差し替えられます。

## 登録方法

1. ファイルを `public/silhouettes/` 以下へ置きます。
2. `src/lib/silhouette-assets.ts` の `SILHOUETTE_ASSETS` に、既存の種類IDで登録します。
3. ビルドし、Previewで位置・色・服同士の重なりを確認します。

例（ファイルが揃ってから追加）：

```ts
export const SILHOUETTE_ASSETS: SilhouetteAssets = {
  mannequin: {
    mode: "image",
    src: "/silhouettes/mannequin.png",
  },
  top: {
    blouse: {
      mode: "mask",
      src: "/silhouettes/top/blouse-mask.png",
      detailsSrc: "/silhouettes/top/blouse-lines.png", // 線画がなければ省略
    },
  },
  bottom: {},
  shoes: {},
};
```

| カテゴリ | 既存の種類ID                   |
| -------- | ------------------------------ |
| Top      | `tee` / `blouse` / `knit`      |
| Bottom   | `skirt` / `straight` / `wide`  |
| Shoes    | `pumps` / `sneakers` / `boots` |

`mask` は素材の透明度で服の面を切り抜き、現在のHEXを適用します。`image` は素材の色をそのまま表示するため、通常はマネキン用です。HEX変更を維持する服は `mask` を使ってください。線画レイヤーの色は固定です。

切り抜き済み素材には `frame: { x, y, width, height }` を指定して位置とサイズを調整できます。塗り面と線画は同じ範囲で書き出してください。比率を維持して中央配置するため、frameも画像と同じ縦横比にします。

## 実装上の分担

- `src/lib/silhouette-assets.ts`：素材と服IDの対応表・キャンバス座標。
- `src/components/silhouette-asset.tsx`：透過画像・HEXマスク・線画の共通描画。未登録または画像の読み込みエラー時は既存SVGへ戻します。
- `src/components/styling-silhouettes.tsx`：従来のSVGと重なり順（マネキン → 靴 → ボトムス → トップス）。
- `src/components/garment.tsx`：既存の表示枠・選択サムネイル・Saved looks。

新しいネックラインや丈の追加は今回行いません。まず既存IDの素材を差し替えられる土台のみを用意しています。素材アップロード画面・保存形式の変更もありません。
