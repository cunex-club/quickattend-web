import Button from "@components/Button";
import GroupFilterButton from "@components/GroupFilterButton";
import TextField from "@components/TextField";
import Icon from "@components/Icon";
import EventNameScan from "@components/EventNameScan";
import WheelPicker from "@components/WheelPicker";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("");

  return (
    <div className="bg-white min-h-screen space-y-6 p-6">
      {/* Typography demo */}
      <section className="grid grid-cols-2 space-y-2">
        <div>
          <p className="display-large-primary">DisplayLarge</p>
          <p className="display-medium-primary">DisplayMedium</p>
          <p className="display-small-primary">DisplaySmall</p>
          <p className="headline-large-primary">HeadlineLarge</p>
          <p className="headline-medium-primary">HeadlineMedium</p>
          <p className="headline-small-primary">HeadlineSmall</p>
          <p className="title-large-primary">TitleLarge</p>
          <p className="title-medium-primary">TitleMedium</p>
          <p className="title-small-primary">TitleSmall</p>
          <p className="label-large-primary">LabelLarge</p>
          <p className="label-medium-primary">LabelMedium</p>
          <p className="label-small-primary">LabelSmall</p>
          <p className="body-large-primary">BodyLarge</p>
          <p className="body-medium-primary">BodyMedium</p>
          <p className="body-small-primary">BodySmall</p>
        </div>
        <div>
          <p className="display-large-emphasized">DisplayLarge Emphasized</p>
          <p className="display-medium-emphasized">DisplayMedium Emphasized</p>
          <p className="display-small-emphasized">DisplaySmall Emphasized</p>
          <p className="headline-large-emphasized">HeadlineLarge Emphasized</p>
          <p className="headline-medium-emphasized">HeadlineMedium Emphasized</p>
          <p className="headline-small-emphasized">HeadlineSmall Emphasized</p>
          <p className="title-large-emphasized">TitleLarge Emphasized</p>
          <p className="title-medium-emphasized">TitleMedium Emphasized</p>
          <p className="title-small-emphasized">TitleSmall Emphasized</p>
          <p className="label-large-emphasized">LabelLarge Emphasized</p>
          <p className="label-medium-emphasized">LabelMedium Emphasized</p>
          <p className="label-small-emphasized">LabelSmall Emphasized</p>
          <p className="body-large-emphasized">BodyLarge Emphasized</p>
          <p className="body-medium-emphasized">BodyMedium Emphasized</p>
          <p className="body-small-emphasized">BodySmall Emphasized</p>
        </div>
      </section>
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
    </div>
  );
}
