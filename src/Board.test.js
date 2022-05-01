import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Board from './Board';

describe("<Board /> renders", function () { 
  describe("initial board and win state", function () {
    it("renders without crashing", function () {
      render(<Board />);
    });

    it("matches snapshot full board", function () {
      const { asFragment } = render(<Board chanceLightStartsOn={1} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it("shows win when lights are out", function () { 
      const { getByText } = render(<Board chanceLightStartsOn={0} />);
      expect(getByText("You win!")).toBeInDocument();
    });
  });

  describe("cell click", function () { 
    it("toggles lights correctly", function () {
      const { getAllByRole } = render(
        <Board nrows={3} ncols={3} chanceLightStartsOn={1} />
      );
      const cells = getAllByRole("button");

      // all cells start out lit
      cells.forEach(cell => {
        expect(cell).toHaveClass("Cell-lit");
      });

      // click on cell in the middle
      fireEvent.click(cells[4]);

      // only corners should be lit
      let litIndices = [0, 2, 6, 8];
      cells.forEach((cell, idx) => {
        if (litIndices.includes(idx)) {
          expect(cell).toHaveClass("Cell-lit");
        } else {
          expect(cell).not.toHaveClass("Cell-lit");
        }
      });
    });

    it("shows you win when clicking the board", function () { 
      // create a board that will be won in a click
      const { queryByText, getAllByRole } = render(
        <Board nrows={1} ncols={3} chanceLightStartsOn={1} />
      );

      // the game is not won
      expect(queryByText("You win!")).not.toBeInDocument();

      // click once on middle cell and win the game
      const cells = getAllByRole("button");
      fireEvent.click(cells[1]);
      expect(queryByText("You win!")).toBeInDocument();
    });
  });
});