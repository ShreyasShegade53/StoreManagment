package com.techvg.store.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techvg.store.IntegrationTest;
import com.techvg.store.domain.StoreName;
import com.techvg.store.repository.StoreNameRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link StoreNameResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StoreNameResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/store-names";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StoreNameRepository storeNameRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStoreNameMockMvc;

    private StoreName storeName;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StoreName createEntity(EntityManager em) {
        StoreName storeName = new StoreName().name(DEFAULT_NAME);
        return storeName;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StoreName createUpdatedEntity(EntityManager em) {
        StoreName storeName = new StoreName().name(UPDATED_NAME);
        return storeName;
    }

    @BeforeEach
    public void initTest() {
        storeName = createEntity(em);
    }

    @Test
    @Transactional
    void createStoreName() throws Exception {
        int databaseSizeBeforeCreate = storeNameRepository.findAll().size();
        // Create the StoreName
        restStoreNameMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(storeName)))
            .andExpect(status().isCreated());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeCreate + 1);
        StoreName testStoreName = storeNameList.get(storeNameList.size() - 1);
        assertThat(testStoreName.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createStoreNameWithExistingId() throws Exception {
        // Create the StoreName with an existing ID
        storeName.setId(1L);

        int databaseSizeBeforeCreate = storeNameRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStoreNameMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(storeName)))
            .andExpect(status().isBadRequest());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStoreNames() throws Exception {
        // Initialize the database
        storeNameRepository.saveAndFlush(storeName);

        // Get all the storeNameList
        restStoreNameMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(storeName.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getStoreName() throws Exception {
        // Initialize the database
        storeNameRepository.saveAndFlush(storeName);

        // Get the storeName
        restStoreNameMockMvc
            .perform(get(ENTITY_API_URL_ID, storeName.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(storeName.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingStoreName() throws Exception {
        // Get the storeName
        restStoreNameMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStoreName() throws Exception {
        // Initialize the database
        storeNameRepository.saveAndFlush(storeName);

        int databaseSizeBeforeUpdate = storeNameRepository.findAll().size();

        // Update the storeName
        StoreName updatedStoreName = storeNameRepository.findById(storeName.getId()).get();
        // Disconnect from session so that the updates on updatedStoreName are not directly saved in db
        em.detach(updatedStoreName);
        updatedStoreName.name(UPDATED_NAME);

        restStoreNameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStoreName.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStoreName))
            )
            .andExpect(status().isOk());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeUpdate);
        StoreName testStoreName = storeNameList.get(storeNameList.size() - 1);
        assertThat(testStoreName.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingStoreName() throws Exception {
        int databaseSizeBeforeUpdate = storeNameRepository.findAll().size();
        storeName.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreNameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, storeName.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(storeName))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStoreName() throws Exception {
        int databaseSizeBeforeUpdate = storeNameRepository.findAll().size();
        storeName.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreNameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(storeName))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStoreName() throws Exception {
        int databaseSizeBeforeUpdate = storeNameRepository.findAll().size();
        storeName.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreNameMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(storeName)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStoreNameWithPatch() throws Exception {
        // Initialize the database
        storeNameRepository.saveAndFlush(storeName);

        int databaseSizeBeforeUpdate = storeNameRepository.findAll().size();

        // Update the storeName using partial update
        StoreName partialUpdatedStoreName = new StoreName();
        partialUpdatedStoreName.setId(storeName.getId());

        restStoreNameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStoreName.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStoreName))
            )
            .andExpect(status().isOk());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeUpdate);
        StoreName testStoreName = storeNameList.get(storeNameList.size() - 1);
        assertThat(testStoreName.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateStoreNameWithPatch() throws Exception {
        // Initialize the database
        storeNameRepository.saveAndFlush(storeName);

        int databaseSizeBeforeUpdate = storeNameRepository.findAll().size();

        // Update the storeName using partial update
        StoreName partialUpdatedStoreName = new StoreName();
        partialUpdatedStoreName.setId(storeName.getId());

        partialUpdatedStoreName.name(UPDATED_NAME);

        restStoreNameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStoreName.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStoreName))
            )
            .andExpect(status().isOk());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeUpdate);
        StoreName testStoreName = storeNameList.get(storeNameList.size() - 1);
        assertThat(testStoreName.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingStoreName() throws Exception {
        int databaseSizeBeforeUpdate = storeNameRepository.findAll().size();
        storeName.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreNameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, storeName.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(storeName))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStoreName() throws Exception {
        int databaseSizeBeforeUpdate = storeNameRepository.findAll().size();
        storeName.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreNameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(storeName))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStoreName() throws Exception {
        int databaseSizeBeforeUpdate = storeNameRepository.findAll().size();
        storeName.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreNameMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(storeName))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StoreName in the database
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStoreName() throws Exception {
        // Initialize the database
        storeNameRepository.saveAndFlush(storeName);

        int databaseSizeBeforeDelete = storeNameRepository.findAll().size();

        // Delete the storeName
        restStoreNameMockMvc
            .perform(delete(ENTITY_API_URL_ID, storeName.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StoreName> storeNameList = storeNameRepository.findAll();
        assertThat(storeNameList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
