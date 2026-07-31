package com.equiply;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class ModularityTest {

    @Test
    void modulesRespectDeclaredBoundaries() {
        ApplicationModules.of(EquiplyApplication.class).verify();
    }
}
