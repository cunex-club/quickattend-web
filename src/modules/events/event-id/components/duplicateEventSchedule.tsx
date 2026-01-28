"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";
import Button from "@shared/Button";
import TextField from "@shared/TextField";
import Icon from "@shared/Icon";
import EventTimePicker from "@shared/EventTimePicker";

interface DuplicateEventScheduleProps {
  schedules: { startTime: string; endTime: string; description: string }[];
  onAddSchedule: (schedule: {
    startTime: string;
    endTime: string;
    description: string;
  }) => void;
  onRemoveSchedule: (index: number) => void;
  onUpdateSchedule: (
    index: number,
    field: "startTime" | "endTime" | "description",
    value: string,
  ) => void;
  evaluationLink: string;
  onEvaluationLinkChange: (value: string) => void;
  onClose: () => void;
  onBack: () => void;
  onConfirm: () => void;
}

const DuplicateEventSchedule = ({
  schedules,
  onAddSchedule,
  onRemoveSchedule,
  onUpdateSchedule,
  evaluationLink,
  onEvaluationLinkChange,
  onClose,
  onBack,
  onConfirm,
}: DuplicateEventScheduleProps) => {
  const t = useTranslations("EventDetail");
  const [newSchedule, setNewSchedule] = useState({
    startTime: "",
    endTime: "",
    description: "",
  });

  const handleAddClick = () => {
    if (newSchedule.startTime && newSchedule.endTime) {
      onAddSchedule(newSchedule);
      setNewSchedule({ startTime: "", endTime: "", description: "" });
    }
  };

  return (
    <div className="flex flex-col max-h-[80vh]">
      <div className="flex justify-between items-center shrink-0 pb-2">
        <div className="headline-large-emphasized text-neutral-600">
          {t("eventSchedule")} <span className="text-red-500">*</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 px-1 py-2">
        {/* Add Section */}
        <div className="bg-neutral-100 p-6 rounded-xl space-y-4">
          <div className="title-medium-emphasized">{t("addScheduleSlot")}</div>
          <EventTimePicker
            startTime={newSchedule.startTime}
            endTime={newSchedule.endTime}
            onStartTimeChange={(v) =>
              setNewSchedule({ ...newSchedule, startTime: v })
            }
            onEndTimeChange={(v) =>
              setNewSchedule({ ...newSchedule, endTime: v })
            }
            className="gap-4"
          />
          <TextField
            placeholder={t("openingCeremonyPlaceholder")}
            value={newSchedule.description}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, description: e.target.value })
            }
            className="w-full bg-white body-medium-primary"
          />
          <Button
            mode="filled"
            bordered="round"
            expanded={false}
            className="bg-primary hover:bg-primary/90  px-6 py-2"
            onClick={handleAddClick}
          >
            <p className="label-large-emphasized text-white">
              {t("addSchedule")}
            </p>
          </Button>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          {schedules.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start gap-8">
                <button
                  className="mt-3 text-red-500"
                  onClick={() => onRemoveSchedule(index)}
                >
                  <Icon name="remove_circle_outline" size={28} />
                </button>
                <div className="flex-1">
                  <EventTimePicker
                    startTime={item.startTime}
                    endTime={item.endTime}
                    onStartTimeChange={(v) =>
                      onUpdateSchedule(index, "startTime", v)
                    }
                    onEndTimeChange={(v) =>
                      onUpdateSchedule(index, "endTime", v)
                    }
                    className="gap-4"
                  />
                </div>
              </div>
              <div className="w-full">
                <TextField
                  value={item.description}
                  onChange={(e) =>
                    onUpdateSchedule(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Evaluation Link */}
        <div className="space-y-2">
          <div className="headline-small-emphasized">
            {t("evaluationFormLink")}
          </div>
          <TextField
            placeholder={t("evaluationFormLinkPlaceholder")}
            value={evaluationLink}
            onChange={(e) => onEvaluationLinkChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 shrink-0">
        <Button
          mode="outline"
          bordered="round"
          expanded={false}
          className="title-large-emphasized !px-12 py-6 border-pink-500 text-pink-500 hover:bg-pink-50"
          onClick={onBack}
        >
          {t("back")}
        </Button>
        <Button
          mode="filled"
          bordered="round"
          expanded={false}
          className="title-large-emphasized !px-12 py-6"
          onClick={onConfirm}
        >
          {t("submitDuplicate")}
        </Button>
      </div>
    </div>
  );
};

export default DuplicateEventSchedule;
