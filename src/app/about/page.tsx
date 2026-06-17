export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="container-page py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-moss">About Nuvoro Market</p>
        <h1 className="mt-3 text-4xl font-black">A curated store for smart everyday products.</h1>
        <p className="mt-5 text-lg text-ink/70">Nuvoro Market is built around practical, affordable products that help make daily routines a little easier. The catalog starts broad so winning products can be validated, refined and later expanded into stronger collections.</p>
        <p className="mt-4 text-ink/70">We focus on clear benefits, straightforward product pages, secure checkout and responsible operations. Product choices should avoid risky categories and supplier claims that cannot be verified.</p>
      </div>
    </section>
  );
}
