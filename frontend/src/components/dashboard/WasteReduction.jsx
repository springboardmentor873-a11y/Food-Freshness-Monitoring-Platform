const locations = [
  ["Chicago Hub", "18.4%"],
  ["Dallas Logistics", "12.1%"],
  ["New Jersey Plant", "24.8%"],
  ["Seattle Storage", "9.2%"],
];

function WasteReduction() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="text-4xl font-bold">
        Waste Reduction
      </h2>

      <p className="mt-2 text-gray-500">
        Performance by location
      </p>

      <div className="mt-8 space-y-8">

        {locations.map(([name, value]) => (
          <div key={name}>

            <div className="mb-3 flex justify-between">

              <p className="font-semibold">
                {name}
              </p>

              <span className="font-bold text-green-600">
                {value}
              </span>

            </div>

            <div className="h-3 rounded-full bg-gray-200">

              <div
                className="h-3 rounded-full bg-green-500"
                style={{
                  width: value,
                }}
              />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default WasteReduction;