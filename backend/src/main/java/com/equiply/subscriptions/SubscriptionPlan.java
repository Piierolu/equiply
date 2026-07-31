package com.equiply.subscriptions;

public enum SubscriptionPlan {
    STARTER(1, 3),
    GROWTH(5, 20),
    PRO(25, 100);

    private final int maxBranches;
    private final int maxUsers;

    SubscriptionPlan(int maxBranches, int maxUsers) {
        this.maxBranches = maxBranches;
        this.maxUsers = maxUsers;
    }

    int maxBranches() {
        return maxBranches;
    }

    int maxUsers() {
        return maxUsers;
    }
}
