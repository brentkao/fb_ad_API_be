export const DEFAULT_CONFIG_SELECTIBLE_COLUMN = [
  { name: "Data Start", value: "data_start", isUsing: true },
  { name: "Data Stop", value: "data_stop", isUsing: true },
  //---//
  { name: "Campaign Name", value: "campaign_name", isUsing: true },
  { name: "Ad Set Name", value: "ad_set_name", isUsing: true },
  { name: "Ad Name", value: "ad_name", isUsing: true },
  { name: "Impressions", value: "impressions", isUsing: true },
  { name: "Clicks", value: "clicks", isUsing: true },
  { name: "Spend", value: "spend", isUsing: true },
  { name: "CTR", value: "ctr", isUsing: true },
  { name: "CPC", value: "cpc", isUsing: true },
  { name: "CPM", value: "cpm", isUsing: true },
];

export const DEFAULT_CONFIG_USUAL_COLUMN = [
  { name: "Link Click", value: "link_click", isUsing: true },
  { name: "Page Views", value: "page_views", isUsing: true },
  { name: "Conversations Started", value: "conversations_started", isUsing: true },
];



export const DEFAULT_AUTO_PARAMETER = {
  USING_TARGET: "weekly",
  WEEKLY_SELECTED_DAY: 1,
  IMPRESSION_THRESHOLD: 0,
} as const;

export const DEFAULT_AUTO_TEMPLATE: {
  usingTarget?: "weekly" | "monthly";
  weekly?: { selectedDay?: number };
  monthly?: { schedules?: { day?: number; hr?: number; min?: number }[] };
  isFilter?: boolean;
  impressionThreshold?: number;
  reportEmailList?: string[];
} = {
  usingTarget: "weekly",
  weekly: { selectedDay: DEFAULT_AUTO_PARAMETER.WEEKLY_SELECTED_DAY },
  monthly: { schedules: [] },
  isFilter: false,
  impressionThreshold: DEFAULT_AUTO_PARAMETER.IMPRESSION_THRESHOLD,
  reportEmailList: [],
};
