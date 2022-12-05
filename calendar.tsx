import { Button, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import dayjs from 'dayjs';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import styles from './calendar.module.less';

interface CalendarProps {
  /** 一周 */
  week?: string[];
  /** 年份 */
  year?: any;
  /** 月份 */
  month?: any;
  /** 每月的最后一天是几号 */
  lastDate?: string;
  /** 日历最多显示多少格（最多6行，一行7格，6 x 7 = 42） */
  countDay?: number;
  /** 是否显示上月 */
  isShowPrevMonth?: boolean;
  /** 是否显示下月 */
  isShowNextMonth?: boolean;
  /** 打卡数据 */
  recordData?: any;
  /** 日期点击 */
  onDayClick?: (res: TaroGeneral.CallbackResult) => void;
}

/**
 * 日历组件
 * @returns
 */
export default function Calendar(props: PropsWithChildren<CalendarProps>) {
  const {
    week = ['日', '一', '二', '三', '四', '五', '六'],
    year = dayjs().year(),
    month = dayjs().month() + 1,
    lastDate = dayjs(`${year}-${month}`).daysInMonth(),
    countDay = 42,
  } = props;

  const [tabs, setTabs] = useState<any>(0);

  const oDate = new Date();

  const prevDay = new Date(year, month - 1, 1).getDay(); // 当月的上一月显示几天
  const prevMonthDay = new Date(year, month - 1, 0).getDate(); //上个月有多少天
  const nowDay = new Date(year, month, 0).getDate(); // 当月有多少天
  const nextDay = countDay - nowDay - prevDay; // 当月的下一月显示几天
  const today = oDate.getDate(); // 今天几号

  // 上个月日历
  const prevMonth: any = [];
  for (let i = 0; i < prevDay; i++) {
    prevMonth.push(prevMonthDay - i);
  }

  oDate.setDate(1);

  const onDayClick = (date: any) => {
    props?.onDayClick && props?.onDayClick(date);
    setTabs(date);
  };

  return (
    <View className={classNames(styles['calendar-container'])}>
      <Button open-type="" onChooseAvatar={() => {}} />
      <View className={classNames(styles.year)}>
        {year}年{month}月
      </View>
      {/* 星期 */}
      <View className={classNames('flex', styles['week-wrap'])}>
        {week.map((item) => (
          <View className={classNames('flex-1', styles.week)} key={item}>
            {item}
          </View>
        ))}
      </View>
      <View className={classNames('flex', styles['date-wrap'])}>
        {/* 上个月 */}
        {prevMonth.reverse().map((item) => (
          <View className={classNames(styles.date)} key={item}>
            <View className={classNames(styles['date-item'])}>{item}</View>
          </View>
        ))}

        {/* 本月 */}
        {[...Array(lastDate)].map((_item, index) => (
          <View
            className={classNames(styles.date, styles.current)}
            key={index}
            onClick={() => onDayClick(`${year}-${month}-${index * 1 + 1}`)}
          >
            <View
              className={classNames(
                styles['date-item'],
                { [styles.today]: index * 1 + 1 === today && tabs === 0 },
                {
                  [styles['other-focus']]:
                    index * 1 + 1 === today && tabs !== 0,
                },
                { [styles.focus]: tabs === `${year}-${month}-${index * 1 + 1}` }
              )}
            >
              {index * 1 + 1}
            </View>
            <View
              className={classNames('flex-row h-center', styles['record-dot'])}
            >
              {Taro.getStorageSync(`${year}-${month}-${index * 1 + 1}`)
                ?.fit && <View className={styles.fit} />}
              {Taro.getStorageSync(`${year}-${month}-${index * 1 + 1}`)
                ?.fruit && <View className={styles.fruit} />}
              {Taro.getStorageSync(`${year}-${month}-${index * 1 + 1}`)
                ?.smoking && <View className={styles.smoking} />}
            </View>
          </View>
        ))}
        {/* 下个月 */}
        {[...Array(nextDay)].map((_item, index) => (
          <View className={classNames(styles.date)} key={index}>
            <View className={classNames(styles['date-item'])}>
              {index * 1 + 1}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
