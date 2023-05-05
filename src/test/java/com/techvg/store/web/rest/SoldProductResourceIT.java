package com.techvg.store.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techvg.store.IntegrationTest;
import com.techvg.store.domain.SoldProduct;
import com.techvg.store.repository.SoldProductRepository;
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
 * Integration tests for the {@link SoldProductResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SoldProductResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CATEGORY = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY = "BBBBBBBBBB";

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    private static final Integer DEFAULT_UNITS = 1;
    private static final Integer UPDATED_UNITS = 2;

    private static final String DEFAULT_COMPANY = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sold-products";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SoldProductRepository soldProductRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSoldProductMockMvc;

    private SoldProduct soldProduct;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SoldProduct createEntity(EntityManager em) {
        SoldProduct soldProduct = new SoldProduct()
            .name(DEFAULT_NAME)
            .category(DEFAULT_CATEGORY)
            .price(DEFAULT_PRICE)
            .units(DEFAULT_UNITS)
            .company(DEFAULT_COMPANY);
        return soldProduct;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SoldProduct createUpdatedEntity(EntityManager em) {
        SoldProduct soldProduct = new SoldProduct()
            .name(UPDATED_NAME)
            .category(UPDATED_CATEGORY)
            .price(UPDATED_PRICE)
            .units(UPDATED_UNITS)
            .company(UPDATED_COMPANY);
        return soldProduct;
    }

    @BeforeEach
    public void initTest() {
        soldProduct = createEntity(em);
    }

    @Test
    @Transactional
    void createSoldProduct() throws Exception {
        int databaseSizeBeforeCreate = soldProductRepository.findAll().size();
        // Create the SoldProduct
        restSoldProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(soldProduct)))
            .andExpect(status().isCreated());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeCreate + 1);
        SoldProduct testSoldProduct = soldProductList.get(soldProductList.size() - 1);
        assertThat(testSoldProduct.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSoldProduct.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testSoldProduct.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testSoldProduct.getUnits()).isEqualTo(DEFAULT_UNITS);
        assertThat(testSoldProduct.getCompany()).isEqualTo(DEFAULT_COMPANY);
    }

    @Test
    @Transactional
    void createSoldProductWithExistingId() throws Exception {
        // Create the SoldProduct with an existing ID
        soldProduct.setId(1L);

        int databaseSizeBeforeCreate = soldProductRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSoldProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(soldProduct)))
            .andExpect(status().isBadRequest());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSoldProducts() throws Exception {
        // Initialize the database
        soldProductRepository.saveAndFlush(soldProduct);

        // Get all the soldProductList
        restSoldProductMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(soldProduct.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].units").value(hasItem(DEFAULT_UNITS)))
            .andExpect(jsonPath("$.[*].company").value(hasItem(DEFAULT_COMPANY)));
    }

    @Test
    @Transactional
    void getSoldProduct() throws Exception {
        // Initialize the database
        soldProductRepository.saveAndFlush(soldProduct);

        // Get the soldProduct
        restSoldProductMockMvc
            .perform(get(ENTITY_API_URL_ID, soldProduct.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(soldProduct.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.units").value(DEFAULT_UNITS))
            .andExpect(jsonPath("$.company").value(DEFAULT_COMPANY));
    }

    @Test
    @Transactional
    void getNonExistingSoldProduct() throws Exception {
        // Get the soldProduct
        restSoldProductMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSoldProduct() throws Exception {
        // Initialize the database
        soldProductRepository.saveAndFlush(soldProduct);

        int databaseSizeBeforeUpdate = soldProductRepository.findAll().size();

        // Update the soldProduct
        SoldProduct updatedSoldProduct = soldProductRepository.findById(soldProduct.getId()).get();
        // Disconnect from session so that the updates on updatedSoldProduct are not directly saved in db
        em.detach(updatedSoldProduct);
        updatedSoldProduct.name(UPDATED_NAME).category(UPDATED_CATEGORY).price(UPDATED_PRICE).units(UPDATED_UNITS).company(UPDATED_COMPANY);

        restSoldProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSoldProduct.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSoldProduct))
            )
            .andExpect(status().isOk());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeUpdate);
        SoldProduct testSoldProduct = soldProductList.get(soldProductList.size() - 1);
        assertThat(testSoldProduct.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSoldProduct.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testSoldProduct.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testSoldProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testSoldProduct.getCompany()).isEqualTo(UPDATED_COMPANY);
    }

    @Test
    @Transactional
    void putNonExistingSoldProduct() throws Exception {
        int databaseSizeBeforeUpdate = soldProductRepository.findAll().size();
        soldProduct.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSoldProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, soldProduct.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(soldProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSoldProduct() throws Exception {
        int databaseSizeBeforeUpdate = soldProductRepository.findAll().size();
        soldProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoldProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(soldProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSoldProduct() throws Exception {
        int databaseSizeBeforeUpdate = soldProductRepository.findAll().size();
        soldProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoldProductMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(soldProduct)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSoldProductWithPatch() throws Exception {
        // Initialize the database
        soldProductRepository.saveAndFlush(soldProduct);

        int databaseSizeBeforeUpdate = soldProductRepository.findAll().size();

        // Update the soldProduct using partial update
        SoldProduct partialUpdatedSoldProduct = new SoldProduct();
        partialUpdatedSoldProduct.setId(soldProduct.getId());

        partialUpdatedSoldProduct.category(UPDATED_CATEGORY).units(UPDATED_UNITS);

        restSoldProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSoldProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSoldProduct))
            )
            .andExpect(status().isOk());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeUpdate);
        SoldProduct testSoldProduct = soldProductList.get(soldProductList.size() - 1);
        assertThat(testSoldProduct.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSoldProduct.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testSoldProduct.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testSoldProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testSoldProduct.getCompany()).isEqualTo(DEFAULT_COMPANY);
    }

    @Test
    @Transactional
    void fullUpdateSoldProductWithPatch() throws Exception {
        // Initialize the database
        soldProductRepository.saveAndFlush(soldProduct);

        int databaseSizeBeforeUpdate = soldProductRepository.findAll().size();

        // Update the soldProduct using partial update
        SoldProduct partialUpdatedSoldProduct = new SoldProduct();
        partialUpdatedSoldProduct.setId(soldProduct.getId());

        partialUpdatedSoldProduct
            .name(UPDATED_NAME)
            .category(UPDATED_CATEGORY)
            .price(UPDATED_PRICE)
            .units(UPDATED_UNITS)
            .company(UPDATED_COMPANY);

        restSoldProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSoldProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSoldProduct))
            )
            .andExpect(status().isOk());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeUpdate);
        SoldProduct testSoldProduct = soldProductList.get(soldProductList.size() - 1);
        assertThat(testSoldProduct.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSoldProduct.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testSoldProduct.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testSoldProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testSoldProduct.getCompany()).isEqualTo(UPDATED_COMPANY);
    }

    @Test
    @Transactional
    void patchNonExistingSoldProduct() throws Exception {
        int databaseSizeBeforeUpdate = soldProductRepository.findAll().size();
        soldProduct.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSoldProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, soldProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(soldProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSoldProduct() throws Exception {
        int databaseSizeBeforeUpdate = soldProductRepository.findAll().size();
        soldProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoldProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(soldProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSoldProduct() throws Exception {
        int databaseSizeBeforeUpdate = soldProductRepository.findAll().size();
        soldProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoldProductMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(soldProduct))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SoldProduct in the database
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSoldProduct() throws Exception {
        // Initialize the database
        soldProductRepository.saveAndFlush(soldProduct);

        int databaseSizeBeforeDelete = soldProductRepository.findAll().size();

        // Delete the soldProduct
        restSoldProductMockMvc
            .perform(delete(ENTITY_API_URL_ID, soldProduct.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SoldProduct> soldProductList = soldProductRepository.findAll();
        assertThat(soldProductList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
