import * as React from "react";
import { useState } from "react";
import { TimeZoneConverter } from "../../utils/TimeZoneConverter";
import { Card, ICardSectionStyles, ICardTokens, ICardSectionTokens } from "@uifabric/react-cards";
import { Icon, Text, ITextStyles, FontWeights, IIconStyles, TagPicker, ITag, ISuggestionItemProps } from "office-ui-fabric-react";

interface IDisplayProps {
    date: Date | null;
    timeZone: string | null;
    format: string;
    options: IDotNetFormatOptions;
    timeZonePickerIconTitle: string;
    timeZonePickerPlaceholder: string;
    timeZonePickerSuggestionsHeaderText: string;
    timeZonePickerNoSuggestionsFoundText: string;
}

const iconStyles: IIconStyles = {
    root: {
        color: '#0078D4',
        fontSize: 24,
        fontWeight: FontWeights.regular,
        marginRight: 8,
        float: 'left'
    }
};
const noneSelectedIconStyles: IIconStyles = {
    root: {
        color: '#c3c3c3',
        fontSize: 72,
        fontWeight: FontWeights.regular,
        padding: 12,
    }
};
const noneSelectedTextStyles: IIconStyles = {
    root: {
        color: '#303030',
        fontWeight: FontWeights.regular,
        padding: 12,
    }
};
const dropdownCardSectionStyles: ICardSectionStyles = {
    root: {
        alignSelf: 'stretch',
        borderBottom: '1px solid #F3F2F1'
    }
};

const timeZoneTags: ITag[] = TimeZoneConverter.availableTimeZones.map(tz => { return { key: tz, name: tz } });

const cardTokens: ICardTokens = { childrenMargin: 12 };
const dropdownCardSectionTokens: ICardSectionTokens = { padding: '0px 0px 12px 0px' };

export const Display = (props: IDisplayProps) => {
    let { date, timeZone, format, options, 
        timeZonePickerIconTitle, timeZonePickerPlaceholder,
        timeZonePickerSuggestionsHeaderText, timeZonePickerNoSuggestionsFoundText
    } = props;

    let initialState: ITag[] = timeZone ? [{ key: timeZone, name: timeZone }] : [];
    let [selectedTimeZones, setSelectedTimeZones] = useState(initialState);

    let results = (date !== null && selectedTimeZones.length)
        ? selectedTimeZones.map(tz => ({ 
            key: tz.key,
            timeZone: tz.key, 
            formattedDate: TimeZoneConverter.convert(date as any, tz.key).toDotNetFormat(format, options) 
        }))
        : [];

    return <Card tokens={cardTokens}>
        <Card.Section styles={dropdownCardSectionStyles} tokens={dropdownCardSectionTokens}>
            <Card.Item>
                <Icon iconName="WorldClock" styles={iconStyles} title={timeZonePickerIconTitle} />
                <TagPicker
                    selectedItems={selectedTimeZones}
                    inputProps={{
                        placeholder: timeZonePickerPlaceholder
                    }}
                    onResolveSuggestions={_onFilterChanged}
                    pickerSuggestionsProps={{
                        suggestionsHeaderText: timeZonePickerSuggestionsHeaderText,
                        noResultsFoundText: timeZonePickerNoSuggestionsFoundText
                    }}
                    itemLimit={1}
                    getTextFromItem={item => item.name}
                    onChange={items => { setSelectedTimeZones(items || []) }}
                    onRenderSuggestionsItem={_onRenderSuggestionsItem}
                />
            </Card.Item>
        </Card.Section>
        <Card.Section>
            <Card.Item>
                {results.length ? (
                    <div>
                        <Icon iconName="Clock" styles={iconStyles} />
                        <Text>{results[0].formattedDate}</Text>
                    </div>
                ) : (
                    <div>
                        <Icon iconName="Balloons" styles={noneSelectedIconStyles} />
                        <br />
                        <Text styles={noneSelectedTextStyles}>No time zone selected. Select a time zone to see the date here.</Text>
                    </div>
                )}
            </Card.Item>
        </Card.Section>
    </Card>;
}

/* <Icon iconName="WorldClock" styles={iconStyles} /> */

const _onRenderSuggestionsItem = (props: ITag, item: ISuggestionItemProps<ITag>) => {
    return <div style={{padding: 12}}>
        <Icon iconName="WorldClock" styles={iconStyles} />
        <span>{props.name}</span>
    </div>
}

  const _onFilterChanged = (filterText: string, tagList?: ITag[]): ITag[] => {
    return filterText
      ? timeZoneTags
          .filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1)
          .filter(tag => tagList?.filter(existingTag => existingTag === tag).length === 0)
      : [];
  };