import React, { FC, useState } from "react";
import { Used } from "./FeeSection";
import { CurrencyRate } from "../types/currencyTypes";
import styles from "./FeeInput.module.css";

type InputType = {
  onChange: (fee: number, from: string, to: string) => void;
  onCurrencySwap: (fee: number, from: string, to: string) => void;
  onDeleteFee: () => void;
  from: string;
  to: string;
  fee: number;
  FromToUsed: Used;
  ToFromUsed: Used;
  CurrencyRate: CurrencyRate;
};

const Input: FC<InputType> = ({
  from,
  to,
  fee = 0,
  FromToUsed,
  CurrencyRate,
  ToFromUsed,
  onChange,
  onDeleteFee,
  onCurrencySwap,
}) => {
  const [isValid, setIsValid] = useState(true);

  function onFormChange({ currentTarget }: any) {
    const { fee, from, to } = currentTarget;
    let value = +fee.value;

    if (value < 0) value = 0;
    if (value > 1) value = 1;
    // else if
    checkForValidNumber(fee.value);
    if (isValid) {
      onChange(value, from.value, to.value);
    }
  }

  function checkForValidNumber(num: number): void {
    setIsValid(num < 0 || num > 1 ? false : true);
  }

  function onDeleteClick() {
    onDeleteFee();
  }
  function onSwitchClick() {
    onCurrencySwap(fee, from, to);
  }

  // Reuseable component => input, select, (composition)
  return (
    <>
      <form
        onChange={onFormChange}
        className={styles.form}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className={styles.input}
          type="number"
          name="fee"
          defaultValue={fee}
          placeholder="Fee"
          min={0}
          max={1}
          step={0.01}
        />

        <select name="from" value={from} className={styles.select}>
          {Object.keys(CurrencyRate)
            .filter((option) => {
              return option === from || ToFromUsed[to].has(option) === false;
            })
            .map((v) => {
              return <option key={v} label={v} value={v} />;
            })}
        </select>
        <button onClick={onSwitchClick} className={styles.switch}>
          <img src="/assets/reverse_arrows.svg" alt="reverse_arrows" />
        </button>
        <select name="to" value={to} className={styles.select}>
          {Object.keys(CurrencyRate)
            .filter((option) => {
              return option === to || FromToUsed[from].has(option) === false;
            })
            .map((v) => {
              return <option key={v} label={v} value={v} />;
            })}
        </select>
        <button onClick={onDeleteClick} className={styles.times}>
          &times;
        </button>
      </form>
      {!isValid && (
        <div className={styles.error}>Please enter a valid amount</div>
      )}
    </>
  );
};

export default Input;
