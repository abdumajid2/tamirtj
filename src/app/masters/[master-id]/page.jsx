// src/app/masters/[id]/page.jsx
import MasterByIdClient from "@/components/masters/MasterByIdClient";

export default function Page() {
  return <MasterByIdClient />; // id сам забирается через useParams()
}
