"use client";

import { useMemo, useState } from "react";

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
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Home() {
  const [v, setV] = useState<Inputs>(initial);

  const result = useMemo(() => {
    const revenue = Math.max(0, v.sellingPrice - v.discount);
    const returns = revenue * (v.returnsRate / 100);
    const netRevenue = revenue - returns;
    const totalVariableCost = v.productCost + v.shipping + v.paymentFee + v.cac;
    const profit = netRevenue - totalVariableCost;
    const margin = netRevenue > 0 ? (profit / netRevenue) * 100 : 0;
    const maxCac = netRevenue - v.productCost - v.shipping - v.paymentFee;
    const breakEvenRoas =
      maxCac > 0 && revenue > 0 ? revenue / maxCac : 0;
    const breakEvenPrice =
      1 - v.returnsRate / 100 > 0
        ? (v.productCost + v.shipping + v.paymentFee + v.cac) /
            (1 - v.returnsRate / 100) +
          v.discount
        : 0;

    return { profit, margin, maxCac, breakEvenRoas, breakEvenPrice };
  }, [v]);

  function update(key: keyof Inputs, value: string) {
    const n = Number(value);
    setV((current) => ({
      ...current,
      [key]: Number.isFinite(n) ? Math.max(0, n) : 0,
    }));
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="eyebrow">Business &amp; Money Tools</div>
        <h1>حاسبة ربح المتجر الإلكتروني</h1>
        <p>
          اعرف الربح الحقيقي لكل طلب، وأقصى CAC يمكنك دفعه، وسعر التعادل قبل
          زيادة الإنفاق الإعلاني.
        </p>
      </section>

      <section className="tool-card">
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
      </section>

      <section className="info">
        <h2>ليه الأداة دي؟</h2>
        <p>
          ROAS وحده لا يوضح إذا كان الطلب مربحًا. الأداة تجمع سعر البيع وتكلفة
          المنتج والشحن والرسوم والإعلانات والمرتجعات في قرار واحد.
        </p>
      </section>
    </main>
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