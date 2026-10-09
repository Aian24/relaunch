import Swal from "sweetalert2";
import confetti from "canvas-confetti";

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF6700", "#2E8B7A", "#090D16", "#3AAB97", "#D4703A"],
    });
  } catch (e) {
    // Ignore if canvas not supported
  }
};

export const showSuccessSwal = async (
  title: string,
  message: string,
  extraHtml?: string
) => {
  triggerConfetti();

  return Swal.fire({
    title: `<span style="font-family: var(--font-outfit), sans-serif; font-weight: 800; font-size: 24px; color: #090D16;">${title}</span>`,
    html: `
      <div style="font-family: var(--font-inter), sans-serif; color: #475569; font-size: 14px; line-height: 1.6; margin-top: 8px;">
        <p>${message}</p>
        ${
          extraHtml
            ? `<div style="margin-top: 12px; padding: 10px 14px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; font-size: 13px; color: #090D16;">${extraHtml}</div>`
            : ""
        }
      </div>
    `,
    icon: "success",
    iconColor: "#2E8B7A",
    confirmButtonText: "Awesome, Got It!",
    confirmButtonColor: "#FF6700",
    background: "#FFFFFF",
    padding: "24px",
    customClass: {
      popup: "rounded-2xl shadow-2xl border border-slate-200",
      confirmButton:
        "px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm",
    },
    buttonsStyling: true,
  });
};

export const showErrorSwal = async (title: string, message: string) => {
  return Swal.fire({
    title: `<span style="font-family: var(--font-outfit), sans-serif; font-weight: 800; font-size: 22px; color: #090D16;">${title}</span>`,
    html: `
      <div style="font-family: var(--font-inter), sans-serif; color: #475569; font-size: 14px; line-height: 1.6;">
        <p>${message}</p>
      </div>
    `,
    icon: "error",
    iconColor: "#EF4444",
    confirmButtonText: "Dismiss",
    confirmButtonColor: "#090D16",
    background: "#FFFFFF",
    padding: "24px",
    customClass: {
      popup: "rounded-2xl shadow-xl border border-slate-200",
      confirmButton:
        "px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider",
    },
  });
};
