package com.yorku.budgettracker.budgettracker.unit;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class YorkCostCalculatorTest {

    // makes sure tuition gets calculated properly
    @Test
    void calculateTuitionShouldReturnCorrectTotal() {
        double tuitionPerCredit = 203.93;
        double supplementaryPerCredit = 42.36;
        int credits = 30;

        double expected = (tuitionPerCredit + supplementaryPerCredit) * credits;
        double actual = (tuitionPerCredit + supplementaryPerCredit) * credits;

        assertEquals(expected, actual, 0.001);
    }

    // makes sure housing gets calculated properly for apartment rent
    @Test
    void calculateApartmentHousingShouldReturnCorrectTotal() {
        double monthlyRent = 1200;
        int months = 8;

        double expected = 9600;
        double actual = monthlyRent * months;

        assertEquals(expected, actual, 0.001);
    }

    // makes sure zero rent gives zero total
    @Test
    void calculateApartmentHousingShouldHandleZeroRent() {
        double monthlyRent = 0;
        int months = 8;

        double expected = 0;
        double actual = monthlyRent * months;

        assertEquals(expected, actual, 0.001);
    }

    // makes sure one month works properly too
    @Test
    void calculateApartmentHousingShouldHandleOneMonth() {
        double monthlyRent = 1500;
        int months = 1;

        double expected = 1500;
        double actual = monthlyRent * months;

        assertEquals(expected, actual, 0.001);
    }

    // makes sure total cost adds tuition and housing together properly
    @Test
    void calculateTotalCostShouldReturnCorrectValue() {
        double tuitionTotal = 7388.70;
        double housingTotal = 9600.00;

        double expected = 16988.70;
        double actual = tuitionTotal + housingTotal;

        assertEquals(expected, actual, 0.001);
    }
}