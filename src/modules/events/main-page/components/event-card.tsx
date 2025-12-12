import { StyleableFC } from "@utils/misc";
import { cn } from "@assets/lib/utils";
import Icon from "@shared/Icon";
import Button from "@shared/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@assets/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@assets/components/ui/dropdown-menu";

type EventCardProps = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  role: string;
  isEnd: boolean;
};

const EventCard: StyleableFC<EventCardProps> = ({
  title,
  description,
  date,
  time,
  location,
  role,
  isEnd,
  className,
  ...props
}) => {
  if (!isEnd) {
    return (
      <div
        className={cn(
          "px-8 py-6 rounded-xl shadow-lg bg-neutral-100 space-y-4",
          className
        )}
        {...props}
      >
        <div className="flex justify-between items-center ">
          <div className="display-small-emphasized">{title}</div>
                      <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Sort"
                  className="m-2.5 text-primary cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
          <Icon name="more_vert" size={32} className="text-primary" />
                </button>
              </DropdownMenuTrigger> {/* will replace with custom drop down later */}
              <DropdownMenuContent align="end" className="py-2">
                <DropdownMenuItem><div className="body-small-primary">แชร์ตัวสแกน QR</div></DropdownMenuItem>
                <DropdownMenuItem><div className="body-small-primary">แชร์สถิติ</div></DropdownMenuItem>
                <DropdownMenuItem><div className="body-small-primary">ทำซ้ำกิจกรรม</div></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start gap-y-4 sm:gap-x-6 md:gap-x-12.5">
          <div className="sm:flex-2 px-4">
            <div className="headline-small-emphasized mb-2">
              รายละเอียดกิจกรรม
            </div>
            <div className="body-large-primary">{description}</div>
          </div>

          <div className="sm:flex-1 space-y-2 px-4">
            <div className="flex items-center gap-2">
              <Icon name="calendar_month" size={16} className="text-primary" />
              <span className="body-large-primary">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="timer" size={16} className="text-primary" />
              {/* replace with time later*/}
              <span className="body-large-primary">{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="location_on" size={16} className="text-primary" />
              {/* replace with location  later*/}
              <span className="body-large-primary">{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="person" size={16} className="text-primary" fill />
              {/* replace with event owner later */}
              <span className="body-large-primary">{role}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <Button mode="filled" bordered="round" expanded>
            <div className="title-medium-primary">สแกนผู้เข้าร่วมกิจกรรม</div>
          </Button>
          <Button mode="outline" bordered="round" expanded>
            <div className="flex justify-center items-center gap-2">
              <Icon name="trending_up" size={24} className="text-primary" />
              <div className="title-medium-primary">สถิติกิจกรรม</div>
            </div>
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Accordion
      type="single"
      collapsible
      className={cn("", className)}
      {...props}
    >
      <AccordionItem
        value="event-details"
        className="px-8 py-6 rounded-xl shadow-lg bg-neutral-100 border-none"
      >
        <AccordionTrigger className="hover:no-underline items-center">
          <div className="flex justify-between items-center w-full">
            <div className="display-small-emphasized">{title}</div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col sm:flex-row sm:items-start gap-y-4 sm:gap-x-6 md:gap-x-12.5 pt-4">
            <div className="sm:flex-2 px-4">
              <div className="headline-small-emphasized mb-2">
                รายละเอียดกิจกรรม
              </div>
              <div className="body-large-primary">{description}</div>
            </div>

            <div className="sm:flex-1 space-y-2 px-4">
              <div className="flex items-center gap-2">
                <Icon
                  name="calendar_month"
                  size={16}
                  className="text-primary"
                />
                <span className="body-large-primary">{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="timer" size={16} className="text-primary" />
                <span className="body-large-primary">{time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  name="location_on"
                  size={16}
                  className="text-primary body-large"
                />
                <span className="body-large-primary">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="person" size={16} className="text-primary" fill />
                <span className="body-large-primary">{role}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-6 mt-4">
            <Button mode="filled" bordered="round" expanded>
              <div className="flex justify-center items-center gap-2">
                <Icon name="trending_up" size={24} />
                <div className="title-medium-primary">สถิติกิจกรรม</div>
              </div>
            </Button>
            <Button mode="outline" bordered="round" expanded>
              <div className="flex justify-center items-center gap-2">
                <Icon name="download" size={24} className="text-primary"/>{" "}
                {/* replace with ionic icon*/}
                <div className="title-medium-primary text-primary">ดาวน์โหลดสถิติ</div>
              </div>
            </Button>
            <Button mode="outline" bordered="round" expanded={false}>
              <Icon name="content_copy" size={24} className="text-primary"/>{/* replace with ionic icon*/}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default EventCard;
