import axios from "axios"
import { accessToken } from "./moocfi"

const BASE_URL = "https://concepts.cs.helsinki.fi"
const PROJECT_ID = "ck2lplhbo0zwh0786hikmj9ai"
const COURSE_ID = "ck8e7v5n11soh0790drl44xso"

export async function fetchConceptsProgress() {
  const res = await axios.get(
    `${BASE_URL}/api/projects/${PROJECT_ID}/courses/${COURSE_ID}/progress`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken()}`,
      },
    },
  )
  return res.data
}
