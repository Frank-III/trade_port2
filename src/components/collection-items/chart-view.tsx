import { Tabs } from "@kobalte/core";
import { TimerReset } from "lucide-solid";
import { Switch } from "@kobalte/core";
import { SolidApexCharts } from "solid-apexcharts";
import { createSignal } from "solid-js";
import { GenericSelect2 } from "../generic-select";
import { outlier, setOutlier, setTimeSpan, timeSpan } from "./signals";
import { timeSpanOptions } from "./val-maps";
import { leftDrawerOpen, setLeftDrawerOpen } from "~/components/global-signals";

export default function ActivityChartView() {
	const [tab, setTab] = createSignal<string>("trades");

	const [options] = createSignal({
		xaxis: {
			categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
		},
	});
	const [series] = createSignal([
		{
			name: "series-1",
			data: [30, 40, 35, 50, 49, 60, 70, 91],
		},
	]);

	const tabStyle =
		"bg-transparent  hover:(text-base-font-receding-color) [&[data-selected]]:(text-offwhite ) px-[12px] ";
	return (
		<Tabs.Root class="h-full">
			<div class="border-border h-45px flex flex-row justify-between space-y-1 border-b pb-1">
				<Tabs.List class="relative flex flex-row justify-between">
					<div class="text-base-font-more-receding-color inline-flex text-[20px] font-normal">
						<button
							type="button"
							class="bg-transparent p-1 lgg:hidden"
							onClick={() => {
								setLeftDrawerOpen(!leftDrawerOpen());
							}}
						>
							<div class="i-mdi-filter-outline text-primary text-22px items-center " />
						</button>
						<Tabs.Trigger class={tabStyle} value="trades">
							Trades
						</Tabs.Trigger>
						<Tabs.Trigger class={tabStyle} value="floors">
							Floors
						</Tabs.Trigger>
						<Tabs.Indicator class="tabs-indicator transition-250 bg-primary absolute bottom--1 h-0.5 transition transition-all " />
					</div>
				</Tabs.List>
				<div class="gap-5px flex flex-row items-center">
					<Switch.Root
						class="inline-flex items-center"
						checked={outlier()}
						onChange={setOutlier}
					>
						<Switch.Label class="text-offwhite mr-6px text-base font-normal">
							Outlier
						</Switch.Label>
						<Switch.Input class="switch__input" />
						<Switch.Control class="[&[data-checked]]:(bg-primary) h-24px w-44px border-border transition-bg bg-background duration-240 p[0_2px] inline-flex items-center rounded-xl border">
							<Switch.Thumb class="h-20px w-20px rounded-10px bg-dark-gray duration-240 transition-transform [&[data-checked]]:translate-x-[calc(100%-1px)]" />
						</Switch.Control>
					</Switch.Root>
					<GenericSelect2<number>
						options={timeSpanOptions}
						val={timeSpan}
						setVal={setTimeSpan}
						defaultIcon={<TimerReset size={20} class="icon-default" />}
					/>
				</div>
			</div>
			<Tabs.Content class="h-full" value="trades">
				<SolidApexCharts
					type="bar"
					options={options()}
					series={series()}
					height={"100%"}
				/>
			</Tabs.Content>
			<Tabs.Content class="" value="floors">
				holders
			</Tabs.Content>
		</Tabs.Root>
	);
}
