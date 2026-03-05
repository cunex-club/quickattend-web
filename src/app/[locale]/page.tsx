import Button from "@shared/Button";
import GroupFilterButton from "@shared/GroupFilterButton";
import TextField from "@shared/TextField";
import Icon from "@shared/Icon";
import EventNameScan from "@shared/EventNameScan";
import WheelPicker from "@shared/WheelPicker";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("");

  return (
    <div className="bg-white min-h-screen space-y-2 ">
      <Button mode="filled" bordered="round" expanded={false}>
        {t("welcome")}
      </Button>
      <Button mode="outline" bordered="round" expanded={false}>
        Label
      </Button>
      <Button mode="filled" bordered="square" expanded={false}>
        Label
      </Button>
      <Button mode="outline" bordered="square" expanded={false}>
        Label
      </Button>
      <Button mode="filled" bordered="round" expanded={true}>
        Label
      </Button>
      <Button mode="outline" bordered="round" expanded={true}>
        Label
      </Button>
      <TextField placeholder="Placeholder" />
      <TextField
        supportingText="supporting text ..."
        placeholder="Placeholder"
      />
      <TextField error supportingText="error ..." placeholder="Placeholder" />
      <TextField endIcon={<span>icon</span>} placeholder="Placeholder" />
      <GroupFilterButton
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ]}
        value="option1"
      />
      <Icon name="home" size={24} fill />
      <Icon name="home" size={24} />
      <Icon name="link" size={24} />
      <EventNameScan label="Event Name" link="https://example.com" />
      <WheelPicker />
      // Variant 1: Basic input
      <TextField placeholder="Place holder" />
      // Variant 2: With supporting text
      <TextField placeholder="Place holder" supportingText="Supporting text" />
      // Variant 3: With separator and icon
      <TextField
        placeholder="Label"
        endIcon={<Icon name="arrow_circle_up" fill />}
        showSeparator={true}
        endIconWrapperClassName="bg-pink-500 text-white rounded-r-lg py-3"
        supportingText="Supporting text"
      />
      // Variant 4: Just icon
      <TextField
        placeholder="Label"
        endIcon={<Icon name="arrow_circle_up" fill />}
        endIconWrapperClassName="text-pink-500"
        supportingText="Supporting text"
      />
    </div>
  );
}
