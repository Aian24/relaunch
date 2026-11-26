import { redirect } from "next/navigation";

export default function LegacyClientAssetsRedirectPage({
  searchParams,
}: {
  searchParams?: { clientId?: string };
}) {
  if (searchParams?.clientId) {
    redirect(`/studio/clients/${encodeURIComponent(searchParams.clientId)}?tab=footage`);
  }
  redirect("/studio/clients");
}
