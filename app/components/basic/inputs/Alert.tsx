export default function Alert({
  msg,
  type,
}: {
  msg: string | undefined | boolean;
  type: "alert" | "info";
}) {
  const colors = [
    {
      type: "alert",
      color: "border-alert-1",
    },
    {
      type: "info",
      color: "border-accent-1",
    },
  ];

  if (msg) {
    return (
      <div
        className={` bg-bg p-4 border rounded-2xl w-full ${
          colors.find((el) => el.type == type)?.color
        }`}
      >
        <strong className="">{msg}</strong>
      </div>
    );
  }
}
