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

export default function EcommerceProfitCalculator() {
  const [v, setV] = useState<Inputs>(initial);
  const trackedFirstInput = useRef(false);

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

    if (!trackedFirstInput.current && typeof window !== "undefined" && typeof window.gtag === "function") {
      trackedFirstInput.current = true;
      window.gtag("event", "calculator_input_started", {
        calculator: "ecommerce_profit",
      });
    }

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "calculator_updated", {
        calculator: "ecommerce_profit",
        changed_field: key,
      });
    }
  }

  return (
    <section className="tool-card" aria-label="Ecommerce profit calculator">
      <div className="section-heading">
        <div>
          <span className="section-kicker">احسبها قبل ما تزود الإعلانات</span>
          <h2>أدخل أرقام الطلب</h2>
        </div>
        <div className="live-badge">نتائج مباشرة</div>
      </div>

      <div className="form-grid">
        <Field label="سعر البيع" value={v.sellingPrice} onChange={(x) => update("sellingPrice", x)} />
        <Field label="تكلفة المنتج" value={v.productCost} onChange={(x) => update("productCost", x)} />
        <Field label="الشحن" value={v.shipping} onChange={(x) => update("shipping", x)} />
        <Field label="رسوم الدفع / المنصة" value={v.paymentFee} onChange={(x) => update("paymentFee", x)} />
        <Field label="الخصم" value={v.discount} onChange={(x) => update("discount", x)} />
        <Field label="CAC / تكلفة الإعلان للطلب" value={v.cac} onChange={(x) => update("cac", x)} />
        <Field label="نسبة المرتجعات %" value={v.returnsRate} onChange={(x) => update("returnsRate", x)} />
      </div>

      <div className="results">
        <Result label="صافي الربح / الطلب" value={money(result.profit)} tone={result.profit >= 0 ? "positive" : "negative"} />
        <Result label="صافي الهامش" value={money(result.margin) + "%"} tone={result.margin >= 0 ? "positive" : "negative"} />
        <Result label="أقصى CAC" value={money(result.maxCac)} tone={result.maxCac >= 0 ? "positive" : "negative"} />
        <Result label="Break-even ROAS" value={result.breakEvenRoas ? money(result.breakEvenRoas) + "x" : "—"} />
        <Result label="سعر البيع عند التعادل" value={money(result.breakEvenPrice)} />
      </div>

      <p className="tool-note">
        المعادلات هنا تنظر إلى الإيراد بعد الخصم والمرتجعات، ثم تطرح تكلفة المنتج
        والشحن والرسوم والإعلان للوصول إلى ربح الطلب الفعلي.
      </p>
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
