import Head from "next/head";
import { use, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSession, getSession } from "next-auth/react";
import { isEqual, sortBy } from "lodash";
import { notifications } from "@mantine/notifications";
import { Check } from "react-feather";
import "antd/dist/antd.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { Text } from "@mantine/core";

import {
  fetch as fetchAppointments,
  toggle as toggleAppointments,
  update as updateAppointment,
  setSelected as setSelectedAppointment,
} from "../store/slices/appointmentSlice";
import { fetch as fetchClients } from "../store/slices/clientSlice";
import AddAppointmentModal from "../components/modals/appointments/addAppointment";
import ViewAppointmentModal from "../components/modals/appointments/viewAppointment";
const Appointments = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef(null);

  const { data: appointments, loading: appointmentsLoading } = useSelector(
    (state) => state.appointment,
    isEqual
  );

  const { data: clients, loading: clientsLoading } = useSelector(
    (state) => state.client,
    isEqual
  );

  const { sideBarOpen } = useSelector((state) => state.utility, isEqual);

  useEffect(() => {
    //set a timer for about 1.5 seconds to wait for the calendar to load
    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    }, 300);
  }, [sideBarOpen]);

  const appointmentsItems = useMemo(() => {
    const data = appointments;

    if (data)
      return sortBy(
        data.map((d) => {
          return {
            title: d.title,
            date: d.dateTime,
            status: d.status,
            id: d._id,
            clientId: d.clientId,
          };
        })
      );
    else return [];
  }, [JSON.stringify(appointments)]);

  const handleView = (info) => {
    const { event } = info;
    const { id } = event;
    const client = clients.find((d) => d._id === event.extendedProps.clientId);
    const selectedAppointment = appointmentsItems.find((d) => d.id === id);
    const updated = {
      ...selectedAppointment,
      client: client,
    };
    dispatch(setSelectedAppointment(updated));
    dispatch(toggleAppointments({ modalView: true }));
  };

  const handleDrag = async (info) => {
    const { event } = info;
    const { id, start } = event;
    //convert start to date format example Wed Oct 04 2023 11:00:00 GMT+0800 (Philippine Standard Time) to 2023-10-04 11:00
    const startDate = moment(start).format("YYYY-MM-DD hh:mm");
    const res = await dispatch(
      updateAppointment({ Id: id, data: { dateTime: startDate } })
    );

    dispatch(fetchAppointments());
    notifications.show({
      title: "Success",
      message: res.message,
      color: "teal",
      icon: <Check />,
    });
  };

  const eventContent = (arg) => {
    //conver timetext to hh:mm a format
    const time = moment(arg.timeText, ["h:mm a"]).format("HH:mm");

    return {
      html: `<b>${arg.event.title}</b>`,
    };
  };

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchClients());
  }, []);

  return (
    <>
      <Head>
        <title>Appointments</title>
      </Head>
      <div className="flex flex-col space-y-4 p-8 pb-4">
        <Text fw={500} size={"xl"}>
          Appointments
        </Text>
        <div className="app-table">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            views={{
              dayGridMonth: {
                type: "dayGridMonth",
                buttonText: "Month",
              },
              timeGridWeek: {
                type: "timeGridWeek",
                buttonText: "Week",
              },
              timeGridDay: {
                type: "timeGridDay",
                buttonText: "Day",
              },
            }}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridDay,timeGridWeek,dayGridMonth",
            }}
            firstDay={1}
            allDaySlot={false}
            editable={true}
            selectable={true}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            eventOverlap={true}
            events={appointmentsItems}
            eventContent={eventContent}
            eventClassNames={(info) => {
              return info.event.extendedProps.status ? "active" : "inactive";
            }}
            eventDrop={(info) => handleDrag(info)}
            eventClick={(info) => handleView(info)}
          />
        </div>
      </div>
      <AddAppointmentModal />
      <ViewAppointmentModal />
    </>
  );
};

export default Appointments;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
