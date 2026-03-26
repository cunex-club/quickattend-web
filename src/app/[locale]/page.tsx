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
    <div className="bg-white min-h-screen space-y-6 p-6">
      {/* Typography demo */}
      <section className="grid grid-cols-2 space-y-2">
        <div className="flex flex-col space-y-8">
          <p className="display-large-primary border flex items-center">
            DisplayLarge
          </p>
          <p className="display-medium-primary border">DisplayMedium</p>
          <p className="display-small-primary border">DisplaySmall</p>
          <p className="headline-large-primary border">HeadlineLarge</p>
          <p className="headline-medium-primary border">HeadlineMedium</p>
          <p className="headline-small-primary border">HeadlineSmall</p>
          <p className="title-large-primary border">TitleLarge</p>
          <p className="title-medium-primary border">TitleMedium</p>
          <p className="title-small-primary border">TitleSmall</p>
          <p className="label-large-primary border">LabelLarge</p>
          <p className="label-medium-primary border">LabelMedium</p>
          <p className="label-small-primary border">LabelSmall</p>
          <p className="body-large-primary border">BodyLarge</p>
          <p className="body-medium-primary border">BodyMedium</p>
          <p className="body-small-primary border">BodySmall</p>
          <p className="text-9xl border">Text 9xl</p>
          <p className="text-7xl border">Text 7xl</p>
          <p className="text-5xl border">Text 5xl</p>
          <p className="text-3xl border">Text 3xl</p>
          <p className="text-xl border">Text xl</p>
          <p className="text-base border">Text base</p>
          <p className="text-xs border">Text xs</p>
        </div>
        <div className="flex flex-col space-y-8">
          <p className="display-large-emphasized border">
            DisplayLarge Emphasized
          </p>
          <p className="display-medium-emphasized border">
            DisplayMedium Emphasized
          </p>
          <p className="display-small-emphasized border">
            DisplaySmall Emphasized
          </p>
          <p className="headline-large-emphasized border">
            HeadlineLarge Emphasized
          </p>
          <p className="headline-medium-emphasized border">
            HeadlineMedium Emphasized
          </p>
          <p className="headline-small-emphasized border">
            HeadlineSmall Emphasized
          </p>
          <p className="title-large-emphasized border">TitleLarge Emphasized</p>
          <p className="title-medium-emphasized border">
            TitleMedium Emphasized
          </p>
          <p className="title-small-emphasized border">TitleSmall Emphasized</p>
          <p className="label-large-emphasized border">LabelLarge Emphasized</p>
          <p className="label-medium-emphasized border">
            LabelMedium Emphasized
          </p>
          <p className="label-small-emphasized border">LabelSmall Emphasized</p>
          <p className="body-large-emphasized border">BodyLarge Emphasized</p>
          <p className="body-medium-emphasized border">BodyMedium Emphasized</p>
          <p className="body-small-emphasized border">BodySmall Emphasized</p>
          <p className="text-8xl border">Text 8xl</p>
          <p className="text-6xl border">Text 6xl</p>
          <p className="text-4xl border">Text 4xl</p>
          <p className="text-2xl border">Text 2xl</p>
          <p className="text-lg border">Text lg</p>
          <p className="text-sm border">Text sm</p>
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
      {/* Variant 1: Basic input */}
      <TextField placeholder="Place holder" />
      {/* Variant 2: With supporting text */}
      <TextField placeholder="Place holder" supportingText="Supporting text" />
      {/* Variant 3: With separator and icon */}
      <TextField
        placeholder="Label"
        endIcon={<Icon name="arrow_circle_up" fill />}
        showSeparator={true}
        endIconWrapperClassName="bg-pink-500 text-white rounded-r-lg py-3"
        supportingText="Supporting text"
      />
      {/* Variant 4: Just icon */}
      <TextField
        placeholder="Label"
        endIcon={<Icon name="arrow_circle_up" fill />}
        endIconWrapperClassName="text-pink-500"
        supportingText="Supporting text"
      />
    </div>
  );
}
