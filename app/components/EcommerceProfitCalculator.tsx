"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Inputs = {
  sellingPrice: number;
  productCost: number;
  shipping: number;
  paymentFee: number;
  discount: number;
  cac: number;
  returnsRate: number;
};

const initial: Inputs = {
  sellingPrice: 100,
  productCost: 30,
  shipping: 10,
  paymentFee: 5,
  discount: 0,
  cac: 20,
  returnsRate: 0,
};

function money(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function EcommerceProfitCalculator({ ar }: { ar: boolean }) {
  const [v, setV] = useState<Inputs>(initial);
  const trackedFirstInput = useRef(false);

  const labels = ar
    ? {
        aria: "حاسبة ربح التجارة الإلكترونية",
        heading: "أدخل أرقام الطلب",
        kicker: "احسبها قبل ما تزود الإعلانات",
        live: "نتائج مباشرة",
        sellingPrice: "سعر البيع",
        productCost: "تكلفة المنتج",
        shipping: "الشحن",
        paymentFee: "رسوم الدفع / المنصة",
        discount: "الخصم",
        cac: "CAC / تكلفة الإعلان للطلب",
        returnsRate: "نسبة المرتجعات %",
        profit: "صافي الربح / الطلب",
        margin: "صافي الهامش",
        maxCac: "أقصى CAC",
        breakEvenRoas: "Break-even ROAS",
        breakEvenPrice: "سعر البيع عند التعادل",
        note: "المعادلات هنا تنظر إلى الإيراد بعد الخصم والمرتجعات، ثم تطرح تكلفة المنتج والشحن والرسوم والإعلان للوصول إلى ربح الطلب الفعلي.",
      }
    : {
        aria: "Ecommerce profit calculator",
        heading: "Enter order economics",
        kicker: "Calculate it before you increase ad spend",
        live: "Live results",
        sellingPrice: "Selling price",
        productCost: "Product cost",
        shipping: "Shipping",
        paymentFee: "Payment / platform fee",
        discount: "Discount",
        cac: "CAC / ad cost per order",
        returnsRate: "Returns rate %",
        profit: "Net profit / order",
        margin: "Net margin",
        maxCac: "Maximum CAC",
        breakEvenRoas: "Break-even ROAS",
        breakEvenPrice: "Break-even selling price",
        note: "These formulas use revenue after discounts and returns, then subtract product cost, shipping, fees, and ad spend to estimate true order profit.",
      };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "calculator_view", {
        calculator: "ecommerce_profit",
      });
    }
  }, []);

  const result = useMemo(() => {
    const revenue = Math.max(0, v.sellingPrice - v.discount);
    const returns = revenue * (v.returnsRate / 100);
    const netRevenue = revenue - returns;
    const nonAdCosts = v.productCost + v.shipping + v.paymentFee;
    const profit = netRevenue - nonAdCosts - v.cac;
    const margin = netRevenue > 0 ? (profit / netRevenue) * 100 : 0;
    const maxCac = netRevenue - nonAdCosts;
    const breakEvenRoas =
      maxCac > 0 && revenue > 0 ? revenue / maxCac : 0;
    const breakEvenPrice =
      1 - v.returnsRate / 100 > 0
        ? (nonAdCosts + v.cac) / (1 - v.returnsRate / 100) + v.discount
        : 0;

    return { profit, margin, maxCac, breakEvenRoas, breakEvenPrice };
  }, [v]);

  function update(key: keyof Inputs, value: string) {
    const n = Number(value);
    setV((current) => ({
      ...current,
      [key]: Number.isFinite(n) ? Math.max(0, n) : 0,
    }));

    if (
      !trackedFirstInput.current &&
      typeof window !== "undefined" &&
      typeof window.gtag === "function"
    ) {
      trackedFirstInput.current = true;
      window.gtag("event", "calculator_input_started", {
        calculator: "ecommerce_profit",
      });
    }
  }

  return (
    <section
      className="tool-card"
      aria-label={labels.aria}
      dir={ar ? "rtl" : "ltr"}
    >
      <div className="section-heading">
        <div>
          <span className="section-kicker">{labels.kicker}</span>
          <h2>{labels.heading}</h2>
        </div>
        <div className="live-badge">{labels.live}</div>
      </div>

      <div className="form-grid">
        <Field label={labels.sellingPrice} value={v.sellingPrice} onChange={(x) => update("sellingPrice", x)} />
        <Field label={labels.productCost} value={v.productCost} onChange={(x) => update("productCost", x)} />
        <Field label={labels.shipping} value={v.shipping} onChange={(x) => update("shipping", x)} />
        <Field label={labels.paymentFee} value={v.paymentFee} onChange={(x) => update("paymentFee", x)} />
        <Field label={labels.discount} value={v.discount} onChange={(x) => update("discount", x)} />
        <Field label={labels.cac} value={v.cac} onChange={(x) => update("cac", x)} />
        <Field label={labels.returnsRate} value={v.returnsRate} onChange={(x) => update("returnsRate", x)} />
      </div>

      <div className="results">
        <Result label={labels.profit} value={money(result.profit)} tone={result.profit >= 0 ? "positive" : "negative"} />
        <Result label={labels.margin} value={money(result.margin) + "%"} tone={result.margin >= 0 ? "positive" : "negative"} />
        <Result label={labels.maxCac} value={money(result.maxCac)} tone={result.maxCac >= 0 ? "positive" : "negative"} />
        <Result label={labels.breakEvenRoas} value={result.breakEvenRoas ? money(result.breakEvenRoas) + "x" : "—"} />
        <Result label={labels.breakEvenPrice} value={money(result.breakEvenPrice)} />
      </div>

      <p className="tool-note">{labels.note}</p>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
      />
    </label>
  );
}

function Result({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <div className="result">
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
    </div>
  );
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
