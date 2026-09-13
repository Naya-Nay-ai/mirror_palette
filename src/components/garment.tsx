import { inkFor, type Category, type Look } from "@/lib/wardrobe";

// All editable garment fills are literal sRGB HEX values: no filters or gradients.
// Shared coordinates keep the editor, shape thumbnails and saved looks consistent.
export function Garment({
  category,
  shape,
  color,
}: {
  category: Category;
  shape: string;
  color: string;
}) {
  const seam = {
    fill: "none",
    stroke: inkFor(color),
    strokeOpacity: 0.3,
    strokeWidth: 1.35,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const body = {
    fill: color,
    stroke: inkFor(color),
    strokeOpacity: 0.3,
    strokeWidth: 1.25,
    strokeLinejoin: "round" as const,
  };
  return (
    <g data-category={category} data-shape={shape} data-color={color}>
      {category === "top" && shape === "tee" && (
        <>
          <path
            {...body}
            d="M150 103 Q180 130 210 103 L238 112 270 171 241 186 222 157 226 281 Q180 290 134 281 L138 157 119 186 90 171 122 112Z"
          />
          <path
            {...seam}
            d="M151 104 Q180 148 209 104 M150 107 Q180 142 210 107 M97 167 122 180 M263 167 238 180 M136 274 Q180 282 224 274"
          />
        </>
      )}
      {category === "top" && shape === "blouse" && (
        <>
          <path
            {...body}
            d="M151 100 133 106 Q111 111 105 137 L87 203 Q83 219 99 228 L106 235 131 226 135 200 144 173 139 236 132 279 Q153 289 180 282 Q207 289 228 279 L221 236 216 173 225 200 229 226 254 235 261 228 Q277 219 273 203 L255 137 Q249 111 227 106 L209 100 180 133Z"
          />
          <path
            {...body}
            d="M151 100 163 93 180 133 158 149 144 114Z M209 100 197 93 180 133 202 149 216 114Z M106 227 132 219 135 237 111 244Z M228 219 254 227 249 244 225 237Z"
          />
          <path
            {...seam}
            d="M180 135 180 277 M137 131 125 184 M223 131 235 184 M151 209 147 259 M209 209 213 259 M99 203 110 221 M261 203 250 221"
          />
          {[161, 185, 209, 233, 257].map((y) => (
            <circle
              key={y}
              cx="181"
              cy={y}
              r="1.7"
              fill={inkFor(color)}
              opacity=".45"
            />
          ))}
        </>
      )}
      {category === "top" && shape === "knit" && (
        <>
          <path
            {...body}
            d="M158 80 Q180 85 202 80 L207 104 234 111 Q248 113 253 133 L273 253 246 259 225 176 229 282 Q180 293 131 282 L135 176 114 259 87 253 107 133 Q112 113 126 111 L153 104Z"
          />
          <path
            {...seam}
            d="M154 104 Q180 115 206 104 M156 96 Q180 105 204 96 M133 268 Q180 278 227 268 M90 241 116 246 M244 246 270 241 M127 119 135 176 M233 119 225 176"
          />
          {[140, 148, 156, 164, 172, 180, 188, 196, 204, 212, 220].map((x) => (
            <path key={x} {...seam} d={`M${x} 274 v10`} />
          ))}
        </>
      )}
      {category === "bottom" && shape === "skirt" && (
        <>
          <path
            {...body}
            d="M137 273 Q180 279 223 273 L235 322 Q245 388 273 467 Q180 496 87 467 Q115 388 125 322Z"
          />
          <path
            {...seam}
            d="M135 284 Q180 291 225 284 M144 301 Q140 380 123 459 M164 299 Q163 392 154 473 M195 299 Q197 392 206 473 M216 301 Q220 380 238 459 M93 459 Q180 485 267 459"
          />
        </>
      )}
      {category === "bottom" && shape === "straight" && (
        <>
          <path
            {...body}
            d="M137 273 Q180 280 223 273 Q232 312 228 343 L221 516 183 516 180 355 177 516 139 516 132 343 Q128 312 137 273Z"
          />
          <path
            {...seam}
            d="M135 288 Q180 295 225 288 M180 293 180 334 172 341 M139 303 Q148 323 136 335 M221 303 Q212 323 224 335 M157 345 157 505 M203 345 203 505 M140 506 177 506 M183 506 222 506"
          />
        </>
      )}
      {category === "bottom" && shape === "wide" && (
        <>
          <path
            {...body}
            d="M137 273 Q180 280 223 273 Q234 306 235 337 L256 517 187 517 180 353 173 517 104 517 125 337 Q126 306 137 273Z"
          />
          <path
            {...seam}
            d="M134 289 Q180 296 226 289 M180 294 180 334 172 341 M151 300 Q153 324 149 349 L135 505 M209 300 Q207 324 211 349 L225 505 M108 507 173 507 M187 507 252 507 M136 301 130 327 M224 301 230 327"
          />
        </>
      )}
      {category === "shoes" && shape === "pumps" && (
        <>
          <path
            {...body}
            d="M143 524 Q151 536 168 523 L174 542 Q167 553 130 552 L118 549 Q126 533 143 524Z M217 524 Q209 536 192 523 L186 542 Q193 553 230 552 L242 549 Q234 533 217 524Z"
          />
          <path
            {...seam}
            d="M128 547 Q151 551 172 541 M232 547 Q209 551 188 541 M168 545 168 554 M192 545 192 554"
          />
        </>
      )}
      {category === "shoes" && shape === "sneakers" && (
        <>
          <path
            {...body}
            d="M142 521 166 521 174 540 173 552 Q140 559 114 551 L114 542 Q122 534 133 533Z M218 521 194 521 186 540 187 552 Q220 559 246 551 L246 542 Q238 534 227 533Z"
          />
          <path
            d="M115 546 Q142 553 173 546 L173 552 Q141 559 115 551Z M245 546 Q218 553 187 546 L187 552 Q219 559 245 551Z"
            fill="#F5F3EF"
            stroke="#8B858C"
            strokeWidth=".8"
          />
          <path
            {...seam}
            d="M140 528 153 533 M135 532 148 537 M130 536 143 541 M220 528 207 533 M225 532 212 537 M230 536 217 541"
          />
        </>
      )}
      {category === "shoes" && shape === "boots" && (
        <>
          <path
            {...body}
            d="M140 480 171 480 169 526 175 540 173 551 161 551 161 546 Q139 555 113 549 L113 541 139 523Z M220 480 189 480 191 526 185 540 187 551 199 551 199 546 Q221 555 247 549 L247 541 221 523Z"
          />
          <path
            {...seam}
            d="M141 486 170 486 M219 486 190 486 M162 490 160 525 M198 490 200 525 M116 545 Q142 551 172 539 M244 545 Q218 551 188 539"
          />
        </>
      )}
    </g>
  );
}

export function Outfit({
  look,
  small = false,
  label = "現在のコーデ",
}: {
  look: Look;
  small?: boolean;
  label?: string;
}) {
  return (
    <svg
      className={small ? "outfit outfit-small" : "outfit"}
      viewBox="65 28 230 545"
      role="img"
      aria-label={label}
    >
      <g fill="#F4F3F1" stroke="#DAD6D3" strokeWidth="1.2">
        <path d="M158 88 158 99 126 112 Q115 121 110 143 L84 239 Q80 253 85 266 L88 279 Q90 287 95 282 L99 264 98 246 137 165 144 224 132 286 140 345 143 522 Q156 530 169 522 L180 357 191 522 Q204 530 217 522 L220 345 228 286 216 224 223 165 262 246 261 264 265 282 Q270 287 272 279 L275 266 Q280 253 276 239 L250 143 Q245 121 234 112 L202 99 202 88Z" />
        <path d="M158 88 Q145 76 148 54 Q150 31 180 31 Q210 31 212 54 Q215 76 202 88 Q180 98 158 88Z" />
      </g>
      <Garment category="bottom" {...look.bottom} />
      <Garment category="top" {...look.top} />
      <Garment category="shoes" {...look.shoes} />
    </svg>
  );
}

export function ShapePreview({
  category,
  shape,
}: {
  category: Category;
  shape: string;
}) {
  const viewBox =
    category === "top"
      ? "75 70 210 225"
      : category === "bottom"
        ? "80 265 200 265"
        : "100 465 160 100";
  return (
    <svg viewBox={viewBox} className="shape-preview" aria-hidden="true">
      <Garment category={category} shape={shape} color="#D5C2C9" />
    </svg>
  );
}
