import React, { useState, useEffecct, useContext, useEffect } from "react";
import ControlInput from "../ControlInput";
export default ({ page }) => {
  if (!page) {
    return "";
  }
  const controls = [...page.controls.values()];

  return (
    <div>
      <h1>{page.title}</h1>
      <p>Page View</p>
      <table>
        <tbody>
          {controls.map((control) => {
            return (
              <tr>
                <td>{control.title}</td>
                <td>
                  <ControlInput page={page} control={control} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
