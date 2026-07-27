function Step({ number, text }) {
  return (
    <div className="flex items-start gap-5">

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 font-bold text-green-600">
        {number}
      </div>

      <p className="leading-7 text-gray-600">
        {text}
      </p>

    </div>
  );
}

function HowItWorksCard() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-gray-600">
        How It Works
      </h3>

      <div className="space-y-8">

        <Step
          number="1"
          text="Upload a high-resolution image of your inventory item."
        />

        <Step
          number="2"
          text="Our AI neural engine identifies freshness markers."
        />

        <Step
          number="3"
          text="Receive a detailed report with estimated shelf life."
        />

      </div>

    </div>
  );
}

export default HowItWorksCard;