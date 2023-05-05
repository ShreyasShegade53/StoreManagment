package com.techvg.store.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techvg.store.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StoreNameTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StoreName.class);
        StoreName storeName1 = new StoreName();
        storeName1.setId(1L);
        StoreName storeName2 = new StoreName();
        storeName2.setId(storeName1.getId());
        assertThat(storeName1).isEqualTo(storeName2);
        storeName2.setId(2L);
        assertThat(storeName1).isNotEqualTo(storeName2);
        storeName1.setId(null);
        assertThat(storeName1).isNotEqualTo(storeName2);
    }
}
