import * as React from "react";
import { Icon, Text, FontWeights, IIconStyles, ITextStyles } from "office-ui-fabric-react";

const noneSelectedIconStyles: IIconStyles = {
    root: {
        color: '#c3c3c3',
        fontSize: 72,
        fontWeight: FontWeights.regular,
        padding: 12,
    }
};
const noneSelectedTextStyles: ITextStyles = {
    root: {
        color: '#303030',
        fontWeight: FontWeights.regular,
        padding: 12,
    }
};

export const NotSelected = () => (
    <div style={{ textAlign: 'center'}}>
        <Icon iconName="Balloons" styles={noneSelectedIconStyles} />
        <br />
        <Text styles={noneSelectedTextStyles}>No time zone selected. Select a time zone to see the date here.</Text>
    </div>
);