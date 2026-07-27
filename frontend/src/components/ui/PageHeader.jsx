function PageHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="mb-8 flex items-center justify-between">

      <div>

        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-lg text-slate-500">
          {subtitle}
        </p>

      </div>

      {action}

    </div>
  );
}

export default PageHeader;