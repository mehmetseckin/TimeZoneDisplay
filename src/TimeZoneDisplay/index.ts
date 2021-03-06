import {IInputs, IOutputs} from "./generated/ManifestTypes";
import "./DateTime.extensions";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Display } from "./components/Display";
import { initializeIcons } from '@uifabric/icons';
import { IDotNetFormatOptions } from "luxon";
initializeIcons(); 

export class TimeZoneDisplay implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private container: HTMLDivElement;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this.container = container;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		ReactDOM.render(
			React.createElement(Display, {
				date: this.getDateInput(context),
				timeZone: this.getdefaultTimeZoneInput(context),
				format: this.getDotNetFormatString(context),
				options: this.getDotNetFormatOptions(context),
				timeZonePickerIconTitle: context.resources.getString("TimeZonePickerIconTitle"),
				timeZonePickerPlaceholder: context.resources.getString("TimeZonePickerPlaceholder"),
				timeZonePickerSuggestionsHeaderText: context.resources.getString("TimeZonePickerSuggestionsHeaderText"),
				timeZonePickerNoSuggestionsFoundText: context.resources.getString("TimeZonePickerNoSuggestionsFoundText")
			}),
			this.container
		);
	}

	private getdefaultTimeZoneInput(context: ComponentFramework.Context<IInputs>): string | null {
		let defaultTimeZoneInput = context.parameters.defaultTimeZoneInput;
		return !!defaultTimeZoneInput.security?.readable ? defaultTimeZoneInput.raw : 'local';
	}

	private getDateInput(context: ComponentFramework.Context<IInputs>) : Date | null {
		let dateInput = context.parameters.dateInput;
		return !!dateInput.security?.readable ? dateInput.raw : null;
	}

	private getDotNetFormatOptions(context: ComponentFramework.Context<IInputs>) : IDotNetFormatOptions {
		return {
			...context.userSettings.dateFormattingInfo
		};
	}

	private getDotNetFormatString(context: ComponentFramework.Context<IInputs>): string
	{
		var type = context.parameters.dateInput.type;
		switch(type)
		{
			case "DateAndTime.DateOnly":
				return context.userSettings.dateFormattingInfo.longDatePattern;
			case "DateAndTime.DateAndTime":
				return context.userSettings.dateFormattingInfo.fullDateTimePattern;
			default:
				throw `Attribute type '${type}' is not supported.`;
		}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}