import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import moment from 'moment';
import styled from 'styled-components';
import useModal from '../../hooks/useModal';
import Modal from '../common/modal/Modal';
import ModalTemplate from '../common/modal/modalTemplate/ModalTemplate';
import AddImgForm from '../common/modal/modalContent/addImgForm/AddImgForm';
import SetContentInfoForm from '../common/modal/modalContent/setContentInfoForm/SetContentInfoForm';
import { useRecoilState } from 'recoil';
import type { InfoType } from '../../recoil/photoInfo';
import { tmpInfoState } from '../../recoil/photoInfo';
import { mockData } from './mockdata';
import { theme } from '../../styles/theme';

const MainCal = () => {
  const [getMoment, setMoment] = useState(moment());
  const { isShowing, modalInfo, setModalVisible } = useModal();
  const [tmpInfo, _] = useRecoilState<InfoType>(tmpInfoState);

  const today: moment.Moment = getMoment;
  const firstWeek: number = today.clone().startOf('month').week();
  let lastWeek = 0;
  today.clone().endOf('month').week() === 1 ? (lastWeek = 53) : (lastWeek = today.clone().endOf('month').week());

  const returnToday = () => setMoment(moment());

  const prevMonth = (): void => {
    setMoment(getMoment.clone().subtract(1, 'month'));
  };

  const nextMonth = (): void => {
    setMoment(getMoment.clone().add(1, 'month'));
  };

  const dates: string[] = [];
  mockData.map((obj) => {
    obj.date !== 'empty' ? dates.push(obj.date) : null;
  });

  const makeCalendar = () => {
    let result: JSX.Element[] = [];
    let week: number = firstWeek;
    for (week; week <= lastWeek; week++) {
      result = result.concat(
        <Week key={week}>
          {Array(7)
            .fill(0)
            .map((_: null, idx: number) => {
              const days: moment.Moment = today.clone().startOf('year').week(week).startOf('week').add(idx, 'day');
              if (dates.includes(days.format('YYYYMMDD'))) {
                return (
                  <Day
                    key={idx}
                    style={{ backgroundImage: `url(images/${days.format('YYYYMMDD')}.jpg)`, backgroundSize: 'cover' }}
                    onClick={setModalVisible}
                  >
                    {/* <Date style={{ backgroundColor: `${theme.color.main}`, color: 'white' }}>{days.format('D')}</Date> */}
                  </Day>
                );
              } else if (moment().format('YYYYMMDD') === days.format('YYYYMMDD')) {
                return (
                  <Day key={idx} onClick={setModalVisible}>
                    <Date style={{ backgroundColor: `${theme.color.main}`, color: 'white' }}>{days.format('D')}</Date>
                  </Day>
                );
              } else if (days.format('MM') !== today.format('MM')) {
                return (
                  <Day key={idx} style={{ color: 'lightgray' }} onClick={setModalVisible}>
                    <Date>{days.format('D')}</Date>
                  </Day>
                );
              } else {
                return (
                  <Day key={idx} style={{ color: `${idx === 0 ? 'red' : 'black'}` }} onClick={setModalVisible}>
                    <Date>{days.format('D')}</Date>
                  </Day>
                );
              }
            })}
        </Week>,
      );
    }
    return result;
  };

  return (
    <Container>
      <Sidebar />
      <Modal isShowing={isShowing} hide={setModalVisible}>
        <ModalTemplate>{tmpInfo.img_url === 'empty' ? <AddImgForm /> : <SetContentInfoForm />}</ModalTemplate>
      </Modal>
      <Title>Photodays</Title>
      <MonthController>
        <Button onClick={prevMonth}>이전달</Button>
        <ThisMonth onClick={returnToday}>{today.format('YYYY년 MM월')}</ThisMonth>
        <Button onClick={nextMonth}>다음달</Button>
      </MonthController>
      <Table>
        <WeekDays>
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </WeekDays>
        <TableBody>{makeCalendar()}</TableBody>
      </Table>
    </Container>
  );
};

export default MainCal;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 1.5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  margin-bottom: 30px;
  font-size: 50px;
  font-family: 'Palette Mosaic', cursive;
  color: ${({ theme }) => theme.color.main};
`;

const MonthController = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const ThisMonth = styled.div`
  margin: 0 20px;
  font-size: 20px;
  cursor: pointer;
`;

const Button = styled.button`
  width: 60px;
  height: 30px;
  color: white;
  background-color: ${({ theme }) => theme.color.main};
  border: 1px solid ${({ theme }) => theme.color.main};
  border-radius: 10px;
  cursor: pointer;
`;

const Table = styled.div`
  /* display: flex; */
  border-top: 1px solid black;
`;

const WeekDays = styled.div`
  display: flex;
  height: 50px;
  border-bottom: 1px solid black;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    font-size: 1.5rem;
  }
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const Week = styled.div`
  display: flex;
  flex-direction: row;
`;

const Day = styled.div`
  display: flex;
  width: 120px;
  height: 100px;
  border-bottom: 1px solid black;
  font-size: 1.5rem;
`;

const Date = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  text-align: center;
  line-height: 40px;
`;
