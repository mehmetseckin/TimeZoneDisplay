import * as React from "react";
import { useState } from "react";
import { TimeZoneConverter } from "../../utils/TimeZoneConverter";
import { Card, ICardSectionStyles, ICardTokens, ICardSectionTokens } from "@uifabric/react-cards";
import { Icon, Text, ITextStyles, FontWeights, IIconStyles, Dropdown, IDropdownProps, IDropdownOption } from "office-ui-fabric-react";

interface IDisplayProps {
    date: Date | null;
    timeZone: string | null;
    format: string;
    options: IDotNetFormatOptions;
}

const textStyles: ITextStyles = {
    root: {
        color: '#333333',
        fontWeight: FontWeights.regular
    }
};
const iconStyles: IIconStyles = {
    root: {
        color: '#0078D4',
        fontSize: 24,
        fontWeight: FontWeights.regular,
        marginRight: 8,
        float: 'left'
    }
};
const iconCardSectionStyles: ICardSectionStyles = {
    root: {
        alignSelf: 'stretch',
        borderRight: '1px solid #F3F2F1'
    }
};

const cardTokens: ICardTokens = { childrenMargin: 12, minWidth: 600 };
const iconCardSectionTokens: ICardSectionTokens = { padding: '0px 12px 0px 0px' };

export const Display = (props: IDisplayProps) => {
    let { date, timeZone, format, options } = props;

    let [selectedTimeZone, setSelectedTimeZone] = useState(timeZone);

    let result = (date !== null && selectedTimeZone !== null && TimeZoneConverter.isValidTimeZone(selectedTimeZone))
        ? TimeZoneConverter.convert(date, selectedTimeZone).toDotNetFormat(format, options)
        : "N/A";

    return <Card horizontal tokens={cardTokens}>
        <Card.Section styles={iconCardSectionStyles} tokens={iconCardSectionTokens} horizontal>
            <Card.Item>
                <Dropdown
                    onRenderPlaceHolder={_onRenderPlaceHolder}
                    onRenderTitle={_onRenderTitle}
                    selectedKey={selectedTimeZone}
                    options={TimeZoneConverter.availableTimeZones.map(tz => { return { key: tz, text: tz } })}
                    onChange={(e, option) => {
                        if (option !== null && option !== undefined) {
                            setSelectedTimeZone(option.key.toString())
                        }
                    }}
                    styles={{dropdown: {minWidth: 200}}}
                />
            </Card.Item>
        </Card.Section>
        <Card.Section>
            <Card.Item>
                <Text styles={textStyles}>{result}</Text>
            </Card.Item>
        </Card.Section>
    </Card>;
}

const _onRenderPlaceHolder = (props?: IDropdownProps): JSX.Element => {
    return <div>
        <Icon iconName="WorldClock" styles={iconStyles} />
        <span>{props?.placeHolder}</span>
    </div>
}

const _onRenderTitle = (options?: IDropdownOption[]): JSX.Element => {
    const option = options && options[0];
    return <div>
        <Icon iconName="WorldClock" styles={iconStyles} />
        <span>{option?.text}</span>
    </div>
}