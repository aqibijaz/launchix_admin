import { useParams } from "react-router";
import { PlanForm } from "./form";

export const PlanEdit = () => {
    const { id } = useParams<{ id: string }>();


    return <PlanForm action="edit" id={id} />

};
