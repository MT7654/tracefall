"use client";

import Link from "next/link";
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag, Star, TriangleAlert } from "lucide-react";
import { useState } from "react";

export default function DemoStore() {
  const [cart, setCart] = useState(false);
  const [failed, setFailed] = useState(false);
  return <main className="store-page">
    <nav className="store-nav"><Link href="/"><ArrowLeft size={16}/> Tracefall</Link><strong>NORTH/01</strong><button><ShoppingBag size={17}/> Bag {cart ? "(1)":"(0)"}</button></nav>
    <section className="product-layout">
      <div className="product-visual"><span>FIELD SERIES · 01</span><div className="shoe"><i/><b/><em/></div><div className="visual-index">01 / 04</div></div>
      <div className="product-info"><span className="product-tag">NEW RELEASE · PERFORMANCE</span><h1>Field Runner<br/><em>Graphite</em></h1><div className="rating"><Star size={15} fill="currentColor"/> 4.9 <span>128 field tests</span></div><p>A technical trail silhouette engineered for long days between asphalt and open ground. Responsive foam, mapped grip, zero excess.</p><div className="product-price">$184 <span>Tax included</span></div><div className="size-row"><span>SELECT SIZE</span><button>40</button><button>41</button><button className="selected">42</button><button>43</button><button>44</button></div>{!cart ? <button className="store-cta" onClick={()=>setCart(true)}>Add to bag <Plus size={18}/></button> : <div className="cart-state"><span><Check size={16}/> Added to bag</span><button data-checkout onClick={()=>setFailed(true)}>Proceed to checkout</button></div>}{failed&&<div className="checkout-failure"><TriangleAlert size={19}/><div><strong>Checkout couldn’t initialize</strong><span>PaymentSDK is not defined · incident seeded for Tracefall</span></div></div>}<div className="store-benefits"><span><ShieldCheck size={15}/> 30-day field trial</span><span><Minus size={15}/> Free SG delivery</span></div></div>
    </section>
  </main>;
}
