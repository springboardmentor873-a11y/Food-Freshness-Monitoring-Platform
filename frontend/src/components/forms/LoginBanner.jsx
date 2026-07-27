function LoginBanner() {
  return (
    <div className="flex flex-col justify-center bg-slate-100 px-16">

      <h1 className="text-6xl font-bold leading-tight text-slate-900">
        Detect Food Freshness
        <br />
        with AI
      </h1>

      <p className="mt-8 max-w-xl text-xl leading-9 text-gray-600">
        Upload food images, receive AI-powered freshness predictions,
        manage inventory, and generate reports—all from one intelligent
        platform.
      </p>

      <div className="mt-14 flex h-80 items-center justify-center rounded-3xl border-2 border-dashed border-green-400 bg-green-50">
        <span className="text-2xl font-semibold text-green-600">
          AI Illustration
        </span>
      </div>

    </div>
  );
}

export default LoginBanner;