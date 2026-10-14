import React from "react";
import Topbar from "../../../components/Topbar";
import SidebarLayout from "./SidebarLayout";

export const StudyStatus = {
    Creation: 0,
    Active: 1,
}

// A study is "over" once its end date has passed (date-only comparison, matching
// the study overview). The edit screens lock an Active study only while it is
// still live; once it is over there is nothing running to protect, so editing is
// unlocked again. Accepts any object carrying an `endDate` (study or setup info).
export const isStudyOver = (study) =>
    !!study && !!study.endDate &&
    new Date(study.endDate.split("T")[0]) < new Date()

export const CreationOrder = [
    "study",
    "information",
    "procedure",
    "integrations",
    "check",
    "done"
]

export const CreationSteps = {
    Information: 0,
    Procedure: 1,
    Integrations: 2,
    Check: 3,
}

export default function StudyCreationLayout(props) {

    const getTitle = (step) => {
        switch (step) {
            case CreationSteps.Information:
                return "Study Information"
            case CreationSteps.Procedure:
                return "Procedure"
            case CreationSteps.Integrations:
                return "Integrations"
            case CreationSteps.Check:
                return "Final Check"
            default:
                return "Create Study"
        }
    }

    return (
        <>
            <Topbar />
            <SidebarLayout step={props.step}>
                <h3 className="headline">{getTitle(props.step)}</h3>
                {props.children}
            </SidebarLayout>
        </>
    )
}