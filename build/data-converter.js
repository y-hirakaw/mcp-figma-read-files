/* ------------------------------------------------------------------ */
/*  データ変換ユーティリティ                                          */
/* ------------------------------------------------------------------ */
export function rgbaToHex({ r, g, b, a }) {
    const to255 = (v) => Math.max(0, Math.min(255, Math.round(v * 255)));
    const toHex = (v) => v.toString(16).padStart(2, "0");
    const hexColor = "#" + [to255(r), to255(g), to255(b)].map(toHex).join("");
    // アルファ値が1未満の場合のみ透明度を追加
    return a < 1 ? hexColor + toHex(to255(a)) : hexColor;
}
export function simplifyNode(n) {
    const size = n.absoluteBoundingBox ?? { width: 0, height: 0 };
    const solidFill = n.fills?.find((f) => f.type === "SOLID");
    const style = n.style ?? {};
    return {
        id: n.id,
        name: n.name,
        type: n.type,
        width: Math.round(size.width),
        height: Math.round(size.height),
        backgroundColor: solidFill?.color ? rgbaToHex(solidFill.color) : undefined,
        cornerRadius: n.cornerRadius,
        padding: {
            left: n.paddingLeft ?? 0,
            right: n.paddingRight ?? 0,
            top: n.paddingTop ?? 0,
            bottom: n.paddingBottom ?? 0,
        },
        text: n.characters
            ? {
                content: n.characters,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                lineHeight: style.lineHeightPx,
                textColor: solidFill?.color ? rgbaToHex(solidFill.color) : undefined,
            }
            : undefined,
    };
}
