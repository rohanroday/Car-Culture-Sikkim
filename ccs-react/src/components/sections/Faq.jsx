export default function Faq() {
  return (
    <>
    {/* 05 questions */}
    <section className="faq pad" id="faq" data-reveal>
      <div className="wrap grid">
        <div className="side">
          <span className="mono rv"><b>05</b> / Questions</span>
          <h2 className="display rv" data-split="h" style={{ '--n': '1', marginTop: '16px' }}>Before you pull up.</h2>
        </div>
        <div className="list rv" style={{ '--n': '2' }}>
          <div className="qa"><button type="button" aria-expanded="false" aria-controls="q1">Do I need a fast car to come?<i aria-hidden="true" /></button><div className="panel" id="q1"><div><p>No. Bring what you drive. Hatchbacks, 4x4s, bikes and project cars park right next to the supercars.</p></div></div></div>
          <div className="qa"><button type="button" aria-expanded="false" aria-controls="q2">How do I hear about the next meet?<i aria-hidden="true" /></button><div className="panel" id="q2"><div><p>The date, the spot and the timing go up on our Instagram first. Follow @car_culture_sikkim_ and you will not miss one.</p></div></div></div>
          <div className="qa"><button type="button" aria-expanded="false" aria-controls="q3">Can I come only to look?<i aria-hidden="true" /></button><div className="panel" id="q3"><div><p>Yes. Plenty of people come to walk the rows, take photos and talk cars. Bring your friends.</p></div></div></div>
          <div className="qa"><button type="button" aria-expanded="false" aria-controls="q4">Is there any racing?<i aria-hidden="true" /></button><div className="panel" id="q4"><div><p>No. Meets are parked up, and drives follow the rules of the road. We want every car to get home in one piece.</p></div></div></div>
          <div className="qa"><button type="button" aria-expanded="false" aria-controls="q5">Can my brand or shop work with CCS?<i aria-hidden="true" /></button><div className="panel" id="q5"><div><p>Yes. DM us on Instagram for promotions and business enquiries.</p></div></div></div>
        </div>
      </div>
    </section>
    </>
  );
}
