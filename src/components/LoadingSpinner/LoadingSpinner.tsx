import styles from './LoadingSpinner.module.scss';

export const LoadingSpinner = () => {
	return (
		<div className={styles.loadingContainer} data-testid='loading-spinner'>
			<div className={styles.loadingSpinner} />
		</div>
	);
};
