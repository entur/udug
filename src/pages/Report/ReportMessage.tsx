import React from 'react'
import { StrongText } from '@entur/typography'
import { splitMessage } from '../../util/splitMessage'

export const ReportMessage = ({ message }: { message: string }) => {
    const split = splitMessage(message)
    return (
        <>
            <StrongText>{split[0]}</StrongText>: {split[1]}
        </>
    )
}
