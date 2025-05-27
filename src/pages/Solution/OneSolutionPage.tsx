import { useParams } from 'react-router-dom'

export default function OneSolution() {
    const params = useParams();
  return (
    <div>OneSolution {params["solution-slug"]}</div>
  )
}
