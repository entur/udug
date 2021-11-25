import React from 'react';
import { EmphasizedText, Heading1, Paragraph } from "@entur/typography";
import { match } from 'react-router';

type ReportParams = {
    codespace: string;
    id: string;
}

type ReportProps = {
    match: match<ReportParams>
}


export const Report = (props: ReportProps) => {
    return (
        <div>
            <Heading1>NeTEx validation report</Heading1>
            <Paragraph>Codespace: <EmphasizedText>{props.match.params.codespace}</EmphasizedText></Paragraph>
            <Paragraph>Report ID: <EmphasizedText>{props.match.params.id}</EmphasizedText></Paragraph>
        </div>
    );
}